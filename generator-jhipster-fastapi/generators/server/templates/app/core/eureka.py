import uuid
from py_eureka_client import eureka_client
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
<%_ if (auth) {  _%>
from fastapi import Request 
<%_ } _%>
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

async def refresh_registry():
    """
    Utility method to retrieve the EurekaClient instance and refresh its registry.
    """
    try:
        logger.info("Refreshing Eureka client registry...")
        client = eureka_client.get_client()  # Retrieve the EurekaClient instance
        await client._EurekaClient__pull_full_registry()  # Call the private method
        logger.info("Eureka client registry refreshed successfully.")
    except Exception as e:
        logger.error(f"Failed to refresh Eureka client registry: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh Eureka client registry")
    
async def shutdown_event():
    logger.info("Shutting down Eureka client...")
    try:
        await eureka_client.stop_async()
        logger.info("Eureka client shut down successfully.")
    except Exception as e:
        logger.error(f"Failed to shut down Eureka client: {e}")


<%_ if (restServer?.length && apiServers){ apiServers.forEach((appServer) =>  { _%>
@router.get("/<%= appServer.baseName %>")
async def <%= appServer.baseName %>(<%_ if (auth) {  _%>request: Request<%_ } _%>):
    try:
        # Refresh the Eureka client registry
        await refresh_registry()

        <%_ if (auth) {  _%>
        headers = {}
        auth_header = request.headers.get("Authorization")
        if auth_header:
            headers["Authorization"] = auth_header
        <%_ } _%>

        # Perform the service call
        app = await eureka_client.do_service_async(
            app_name="<%= appServer.baseName %>",
            service="/api/services/<%= appServer.baseName %>",
            <%_ if (auth) {  _%>
            headers=headers,
            <%_ } _%>
            return_type="json")
        return app
       
    except Exception as e:
        # Handle other exceptions
        print("An error occurred:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error, Try Again!")

<%_ })} _%>