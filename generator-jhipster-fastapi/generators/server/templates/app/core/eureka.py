from py_eureka_client import eureka_client
from dotenv import load_dotenv
from fastapi import APIRouter
import os
import requests
import json
import xmltodict
import logging

load_dotenv()

EUREKA_SERVER = os.getenv("EUREKA_SERVER_URL")
APP_NAME = os.getenv("APP_NAME")
PORT = os.getenv("SERVER_PORT")    
OTHER_SERVICE_NAME = os.getenv("OTHER_SERVICE_NAME")
EUREKA_SERVER_INSTANCES = os.getenv("EUREKA_SERVER_INSTANCES")
PUBLIC_IP = os.getenv("PUBLIC_IP", "0.0.0.0")
OTHER_SERVICE_URL = os.getenv("OTHER_SERVICE_URL")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix='/<%= baseName %>',
    tags=['<%= baseName %>']
)

async def startup_event():
    logger.info("Starting Eureka client...")
    try:
        await eureka_client.init_async(
            eureka_server=EUREKA_SERVER,
            app_name=APP_NAME,
            instance_port=int(PORT)
        )
        logger.info(f"Service {APP_NAME} registered successfully with Eureka at {EUREKA_SERVER}")
    except Exception as e:
        logger.error(f"Failed to register service {APP_NAME} with Eureka: {e}")

async def shutdown_event():
    logger.info("Shutting down Eureka client...")
    try:
        await eureka_client.fini_async()
        logger.info("Eureka client shut down successfully.")
    except Exception as e:
        logger.error(f"Failed to shut down Eureka client: {e}")

@router.get("/get_other")
def get_other():
    try:
        response = requests.get(EUREKA_SERVER_INSTANCES)
        response.raise_for_status()  # Raises an exception for HTTP errors
    except requests.RequestException as e:
        logger.error(f"Failed to fetch instances from Eureka: {e}")
        return {"error": "Failed to fetch instances from Eureka"}
    
    app_name = OTHER_SERVICE_NAME
    xml_string = response.text  
    response_app_url = xml_to_json(xml_string, app_name)
    
    if "error" in response_app_url:
        return {"error": response_app_url["error"]}

    return {"response_app_url": response_app_url}

def xml_to_json(xml_string, app_name):
    data_dict = xmltodict.parse(xml_string)
    json_string = json.dumps(data_dict)
    json_file = json.loads(json_string)

    # Extract application information
    applications = json_file.get("applications", {}).get("application", [])
   
    for application in applications:
        if application.get("name") == app_name:
            instances = application.get("instance", [])
            if not isinstance(instances, list):
                instances = [instances]
            for instance in instances:
                ip_address = instance.get("ipAddr", "")
                port = instance.get("port", {}).get("#text", "")
                base_url = f"http://{ip_address}:{port}"
                response_app_url = f"{base_url}{OTHER_SERVICE_URL}"
                logger.info(f"Resolved service URL: {response_app_url}")
                response = requests.get(response_app_url)
                return response.json()
           
    return {"error": "No instance found for the given app name"}
