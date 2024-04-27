import os
from core.log_config import logger

APP_NAME = os.getenv("APP_NAME")
APP_VERSION = os.getenv("APP_VERSION")
APP_DISCRIPTION = os.getenv("APP_DISCRIPTION")


def fetch_app_details():
    logger.info("Generating application details")
    app_details = {
        "name": APP_NAME,
        "version": APP_VERSION,
        "description": APP_DISCRIPTION,
        "status": "Running",
    }
    return app_details
