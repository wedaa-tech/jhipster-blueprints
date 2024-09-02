import os
import motor.motor_asyncio
import logging
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize global variables
client = None
database = None

# Type alias for PyObjectId using Annotated
PyObjectId = Annotated[str, BeforeValidator(str)]

def get_database():
    """Return the connected database."""
    return database

async def connect_to_mongodb():
    """Attempt to connect to MongoDB and set the global client and database."""
    global client, database
    try:
        # Fetch MongoDB URL from environment variables
        mongo_db_url = os.getenv('MONGO_DB_URL')
        if not mongo_db_url:
            raise ValueError("MONGO_DB_URL is not set")

        # Initialize the MongoDB client
        client = motor.motor_asyncio.AsyncIOMotorClient(mongo_db_url)

        # Extract the database name from the URL
        database_name = mongo_db_url.rsplit('/', 1)[-1]
        if not database_name:
            raise ValueError("Database name could not be determined from MONGO_DB_URL")

        # Get the database object
        database = client[database_name]

        # Verify the connection by listing collections or similar operation
        await client.server_info()  # Ensures the connection is valid

        logger.info("Database connected successfully!")
        print("Database connected successfully!")
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        print(f"Error connecting to database: {e}")
        raise



async def disconnect_from_mongodb():
    """Disconnect from MongoDB."""
    global client
    if client:
        client.close()
        logger.info("Database disconnected successfully!")
        print("Database disconnected successfully!")
    else:
        logger.info("Database was not connected.")
        print("Database was not connected.")
        