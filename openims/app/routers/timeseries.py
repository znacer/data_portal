from datetime import datetime
import io
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/timeseries",
    tags=["timeseries"],
)


@router.post("/export/parquet", response_class=FileResponse)
async def export_data_to_parquet(
    request_data: schemas.FileRequest = Body(...), db: Session = Depends(get_db)
):
    """
    Exports timeseries data to a Parquet file.
    - **start_date**: Start timestamp (ISO 8601 format).
    - **end_date**: End timestamp (ISO 8601 format).
    - **sensor_ids**: List of sensor IDs to include.
    """
    start_date = datetime(year=2022, month=1, day=1, hour=0)
    end_date = datetime.now()
    if request_data.start_date is not None:
        start_date = request_data.start_date
    if request_data.end_date is not None:
        end_date = request_data.end_date
    if start_date >= end_date:
        raise HTTPException(
            status_code=400, detail="start_date must be before end_date"
        )

    db_data = crud.get_timeseries_data_for_export(
        db,
        start_date=start_date,
        end_date=end_date,
        sensor_ids=request_data.sensor_ids,
        ship_id=request_data.ship_id,
    )

    if not db_data:
        raise HTTPException(
            status_code=404, detail="No data found for the given criteria."
        )

    df = crud.create_parquet_file(db_data)

    # df.write_parquet(file=filepath)
    # return filepath

    if "parquet" == "parquet":  # TODO: csv flavor
        stream = io.BytesIO()
        df.write_parquet(stream)
        stream.seek(0)
        return StreamingResponse(
            stream,
            media_type="application/octet-stream",
            headers={"Content-Disposition": "attachment; filename=aggregate.parquet"},
        )


@router.post("/analyze/time_buckets", response_model=List[schemas.TimeBucketItem])
async def get_time_bucketed_data(
    request_data: schemas.TimeBucketRequest = Body(...), db: Session = Depends(get_db)
):
    """
    Returns time-bucketed record counts for a sensor.
    - **sensor_id**: The ID of the sensor.
    - **start_date**: Start timestamp (ISO 8601 format).
    - **end_date**: End timestamp (ISO 8601 format).
    - **time_width**: The width of each time bucket (e.g., "15 minutes", "1 hour", "1 day").
    """
    if request_data.start_date >= request_data.end_date:
        raise HTTPException(
            status_code=400, detail="start_date must be before end_date"
        )

    results = crud.get_time_bucket_counts(
        db,
        sensor_id=request_data.sensor_id,
        ship_id=request_data.ship_id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        time_width=request_data.time_width,
    )

    if not results:
        # Return empty list if no data, or 404 if that's preferred
        return []

    # Convert list of tuples/RowProxies to list of Pydantic models
    response_items = [
        schemas.TimeBucketItem(time_bucket=row[0], count=row[1]) for row in results
    ]
    return response_items
