import uuid
from py_eureka_client import eureka_client
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import os
import logging

load_dotenv()

EUREKA_SERVER = os.getenv("EUREKA_SERVER_URL")
APP_NAME = os.getenv("APP_NAME")
APP_PORT = os.getenv("SERVER_PORT")    

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix='/rest/services'
)

async def startup_event():
    logger.info("Starting Eureka client...")
    try:
        instance_id = APP_NAME + ':' + uuid.uuid4().hex
        await eureka_client.init_async(
            eureka_server=EUREKA_SERVER,
            app_name=APP_NAME,
            instance_id=instance_id,
            instance_port=int(APP_PORT)
        )
        logger.info(f"Service {APP_NAME} registered successfully with Eureka at {EUREKA_SERVER}")
    except Exception as e:
        logger.error(f"Failed to register service {APP_NAME} with Eureka: {e}")

async def shutdown_event():
    logger.info("Shutting down Eureka client...")
    try:
        await eureka_client.stop_async()
        logger.info("Eureka client shut down successfully.")
    except Exception as e:
        logger.error(f"Failed to shut down Eureka client: {e}")

<%_ if (restServer?.length && apiServers){ apiServers.forEach((appServer) =>  { _%>
@router.get("/<%= appServer.baseName %>")
async def <%= appServer.baseName %>():
    try:
        app = await eureka_client.do_service_async(app_name="<%= appServer.baseName %>", service="/api/services/<%= appServer.baseName %>", return_type="json")
        return app
       
    except Exception as e:
        # Handle other exceptions
        print("An error occurred:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

<%_ })} _%>