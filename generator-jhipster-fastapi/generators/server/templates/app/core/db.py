# import os
# import motor.motor_asyncio
# from .log_config import logger
# from typing_extensions import Annotated
# from pydantic.functional_validators import BeforeValidator

# client = None
# database = None

# PyObjectId = Annotated[str, BeforeValidator(str)]

# def get_database():
#     return database

# def connect_to_mongodb():
#     global client, database
#     try:
#         client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGO_URI'))
#         database = client.get_database(os.getenv('DATABASE_NAME'))
#         logger.info("Database connected successfully!")
#     except Exception as e:
#         logger.error(f"Error connecting to database: {e}")
#         raise
