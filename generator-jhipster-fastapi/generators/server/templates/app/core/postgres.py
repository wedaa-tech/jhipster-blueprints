import os
import asyncpg
import logging
from contextlib import asynccontextmanager

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Global variable for the connection pool
connection_pool = None

async def connect_to_postgresql():
    """Attempt to connect to PostgreSQL and set up a connection pool."""
    global connection_pool
    try:
        # Fetch PostgreSQL URL from environment variables
        postgres_db_url = os.getenv('POSTGRESQL_DB_URL')
        if not postgres_db_url:
            raise ValueError("POSTGRESQL_DB_URL is not set")

        # Initialize the connection pool
        connection_pool = await asyncpg.create_pool(postgres_db_url)

        # Verify the connection by acquiring and releasing a connection
        async with connection_pool.acquire() as connection:
            await connection.fetchval('SELECT 1')

        logger.info("PostgreSQL connected successfully!")
        print("PostgreSQL connected successfully!")
    except Exception as e:
        logger.error(f"Error connecting to PostgreSQL: {e}")
        print(f"Error connecting to PostgreSQL: {e}")
        raise

async def disconnect_postgresql():
    """Close the PostgreSQL connection pool."""
    global connection_pool
    if connection_pool:
        await connection_pool.close()
        logger.info("PostgreSQL connection closed.")
        print("PostgreSQL connection closed.")

