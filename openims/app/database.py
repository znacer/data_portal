from loguru import logger
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)  # Add pool_pre_ping=True for robustness
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(db: Session):
    # Check and enable TimescaleDB extension
    try:
        db.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"))
        db.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit CASCADE;"))
        db.commit()
        logger.debug("TimescaleDB extension enabled (or already exists).")
    except Exception as e:
        logger.warning(f"Error enabling TimescaleDB extension: {e}")
        db.rollback()
        # Optionally re-raise or handle more gracefully

    # Create tables (if they don't exist)
    Base.metadata.create_all(bind=engine)
    logger.debug("Tables created (if they didn't exist).")

    # Convert timeseries_data to hypertable
    # Important: This should ideally be done once.
    # For robustness, check if it's already a hypertable.
    hypertable_check = db.execute(
        text(
            "SELECT 1 FROM timescaledb_information.hypertables WHERE hypertable_name = 'timeseries_data';"
        )
    ).scalar_one_or_none()

    if not hypertable_check:
        try:
            # Ensure the table exists before trying to make it a hypertable
            # Base.metadata.create_all(bind=engine) should have done this
            db.execute(
                text(
                    "SELECT create_hypertable('timeseries_data', 'timestamp', if_not_exists => TRUE);"
                )
            )
            db.commit()
            logger.info(
                "Table 'timeseries_data' converted to hypertable (or already was)."
            )
        except Exception as e:
            logger.warning(f"Error converting 'timeseries_data' to hypertable: {e}")
            logger.warning(
                "This might happen if the table is not empty or 'timestamp' column is missing/incorrect."
            )
            db.rollback()
    else:
        logger.debug("'timeseries_data' is already a hypertable.")
