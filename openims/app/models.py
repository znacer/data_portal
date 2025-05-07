from datetime import datetime

from sqlalchemy import DDL, Column, DateTime, Float, Index, String, event

from .database import Base


class TimeseriesData(Base):
    __tablename__ = "timeseries_data"

    sensor_id = Column(String, index=True, nullable=False, primary_key=True)
    ship_id = Column(String, index=True, nullable=False, primary_key=True)
    timestamp = Column(
        DateTime, index=True, nullable=False, default=datetime.now(), primary_key=True
    )
    value = Column(Float, nullable=False)

    # Add __table_args__ for multi-column indexes
    __table_args__ = (
        Index(
            "ix_timeseries_data_sensor_system_timestamp",
            "sensor_id",
            "ship_id",
            "timestamp",
        ),
    )

    def __repr__(self):
        return f"<TimeseriesData(timestamp='{self.timestamp}', sensor_id='{self.sensor_id}', value='{self.value}')>"


event.listen(
    TimeseriesData.__table__,
    "after_create",
    DDL(f"SELECT create_hypertable('{TimeseriesData.__tablename__}', 'timestamp');"),
)
