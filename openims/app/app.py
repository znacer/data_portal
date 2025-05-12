from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import init_db, get_db, SessionLocal
from app.routers import timeseries


# # Create tables and hypertable on startup
@asynccontextmanager
async def on_startup(app: FastAPI):
    # It's better to run migrations/setup outside the app startup for production
    # But for simplicity in a small app, this can be done here.
    # Ensure you have a DB session for init_db
    db = SessionLocal()
    try:
        init_db(db)  # Pass the session to init_db
    finally:
        db.close()
    yield


app = FastAPI(title="TimescaleDB Data API", lifespan=on_startup)
app.include_router(timeseries.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the TimescaleDB Data API. See /docs for details."}


# Example: Adding some dummy data (optional, for testing)
# You can create a separate script for this or a debug endpoint
@app.post("/debug/add_dummy_data")
async def add_dummy_data(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta, timezone
    from app.models import TimeseriesData
    import random

    db.query(TimeseriesData).delete()  # Clear existing test data
    db.commit()

    start_time = datetime.now(timezone.utc) - timedelta(days=5)
    sensors = ["sensor_A", "sensor_B", "sensor_C"]
    data_points = []
    for i in range(1000):
        for sensor in sensors:
            if (
                random.random() < 0.7
            ):  # ~70% chance to add data for this sensor at this timestamp
                ts_data = TimeseriesData(
                    timestamp=start_time + timedelta(minutes=i * 10),
                    sensor_id=sensor,
                    ship_id="FREMM",
                    value=random.uniform(10, 50),
                )
                data_points.append(ts_data)

    db.add_all(data_points)
    db.commit()
    return {"message": f"{len(data_points)} dummy data points added."}
