import os

# import uuid
from datetime import datetime
from typing import List, Tuple

import polars as pl
from loguru import logger
from sqlalchemy import Row, func, text
from sqlalchemy.orm import Session

from app import models

DATA_DIR = "data"  # Define at the top or get from config


def get_timeseries_data_for_export(
    db: Session,
    start_date: datetime,
    end_date: datetime,
    sensor_ids: List[str],
    ship_id: str,
) -> List[models.TimeseriesData]:
    if end_date >= start_date:
        logger.warning("end_date cannot be prior to start_date")
        raise ValueError("end_date cannot be prior to start_date")
    query = (
        db.query(models.TimeseriesData)
        .filter(
            models.TimeseriesData.timestamp >= start_date,
            models.TimeseriesData.timestamp <= end_date,
            models.TimeseriesData.sensor_id.in_(sensor_ids),
            models.TimeseriesData.ship_id == ship_id,
        )
        .order_by(models.TimeseriesData.timestamp)
    )
    return query.all()


def create_parquet_file(data: List[models.TimeseriesData]) -> pl.DataFrame:
    if not data:
        # Handle empty data case: create an empty parquet file or raise error
        df = pl.DataFrame(schema=["timestamp", "sensor_id", "ship_id", "value"])
    else:
        # Convert list of ORM objects to list of dicts for DataFrame
        data_dicts = [
            {
                "timestamp": d.timestamp,
                "sensor_id": d.sensor_id,
                "ship_id": d.ship_id,
                "value": d.value,
            }
            for d in data
        ]
        df = pl.from_dicts(data_dicts)

    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    return df
    # filename = f"export_{uuid.uuid4()}.parquet"
    # filepath = os.path.join(DATA_DIR, filename)
    #
    # df.write_parquet(file=filepath)
    # return filepath


def get_time_bucket_counts(
    db: Session,
    sensor_id: str,
    ship_id: str,
    start_date: datetime,
    end_date: datetime,
    time_width: str,
) -> List[Row[Tuple[datetime, int]]]:
    """
    Fetches time bucketed counts for a given sensor.
    Uses TimescaleDB's time_bucket function.
    """
    # The time_width string needs to be passed as a literal interval to SQL.
    # Using SQLAlchemy's text() for the interval part is safer to avoid SQL injection if time_width were complex.
    # However, for simple "N unit" strings, direct construction is also common but less safe if not validated.
    # Here, schemas.py performs basic validation on time_width.

    # Using func.time_bucket with string literal for interval
    # For example, if time_width is "1 hour", it becomes `time_bucket('1 hour', timestamp)`
    # The column `timestamp` in TimeseriesData is DateTime(timezone=True), so time_bucket should work correctly.

    bucket_column = func.time_bucket(
        text(f"'{time_width}'::interval"), models.TimeseriesData.timestamp
    ).label("bucket")
    count_column = func.count(models.TimeseriesData.sensor_id).label("record_count")

    query = (
        db.query(bucket_column, count_column)
        .filter(models.TimeseriesData.sensor_id == sensor_id)
        .filter(models.TimeseriesData.ship_id == ship_id)
        .filter(models.TimeseriesData.timestamp >= start_date)
        .filter(models.TimeseriesData.timestamp <= end_date)
        .group_by("bucket")  # Group by the aliased bucket column
        .order_by("bucket")
    )

    # The result will be a list of RowProxy objects, e.g., [(datetime_obj, count_int), ...]
    results = query.all()
    return results
