from datetime import datetime
from typing import List, Optional

from loguru import logger
from pydantic import BaseModel, field_validator


class TimeseriesDataBase(BaseModel):
    timestamp: datetime
    sensor_id: str
    ship_id: str
    value: Optional[float] = None


class TimeseriesData(TimeseriesDataBase):
    class Config:
        from_attributes = True


### Request Schemas ###
class FileRequest(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    sensor_ids: List[str]
    ship_id: str

    @field_validator("sensor_ids")
    def sensor_ids_must_not_be_empty(cls, v):
        if not v:
            logger.error("sensor_ids list cannot be empty")
            raise ValueError("sensor_ids list cannot be empty")
        return v

    @field_validator("ship_id")
    def sensor_ids_must_not_be_null(cls, v):
        if v == "":
            logger.error("ship_id list cannot be null")
            raise ValueError("shu list cannot be null")
        return v


class TimeBucketRequest(BaseModel):
    sensor_id: str
    ship_id: str
    start_date: datetime
    end_date: datetime
    time_width: str  # e.g., "1 hour", "15 minutes", "1 day"

    @field_validator("time_width")
    def time_width_format(cls, v):
        # Basic validation, can be extended
        parts = v.split()
        if len(parts) != 2 or not parts[0].isdigit():
            raise ValueError('time_width must be in format like "1 hour", "15 minutes"')
        allowed_units = [
            "second",
            "seconds",
            "minute",
            "minutes",
            "hour",
            "hours",
            "day",
            "days",
            "week",
            "weeks",
            "month",
            "months",
            "year",
            "years",
        ]
        if parts[1].lower() not in allowed_units:
            raise ValueError(f"Unsupported time unit in time_width: {parts[1]}")
        return v


### Response Schemas ###
class TimeBucketItem(BaseModel):
    time_bucket: datetime
    count: int
