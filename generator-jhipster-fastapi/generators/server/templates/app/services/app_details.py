import os
from core.log_config import logger



def fetch_app_details():
    logger.info("Generating application details")
    app_details = {
        "status": "Running",
    }
    return app_details
    