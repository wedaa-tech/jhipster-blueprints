import os
from core.log_config import logger

from core.log_config import logger
from dotenv import load_dotenv


APP_NAME = os.getenv("APP_NAME", "app")


def fetch_app_details():
    logger.info("Generating application details")
    app_details = {
        "status": "running", 
        "service": APP_NAME
    }
    return app_details
    