from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn
from api.main import api_router
<%_ if (mongodb){  _%>
from core import mongodb
<%_ } _%>
<%_ if (postgresql){  _%>
from core import postgres
<%_ } _%>
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
<%_ if (eureka) { _%>
from core import eureka
<%_ } _%>

load_dotenv()
# generate some text

SERVER_PORT = int(os.getenv("SERVER_PORT", 9001))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This will run when the application starts
    <%_ if (mongodb){  _%>
    await mongodb.connect_to_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.connect_to_postgresql()  # Connect to PostgreSQL
    <%_ } _%>

    <%_ if (eureka) { _%>
    await eureka.startup_event()
    <%_ } _%>

    yield  # The application will run here
    # This will run when the application stops
    <%_ if (mongodb){  _%>
    await mongodb.disconnect_from_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.disconnect_from_postgresql()  # Disconnect from PostgreSQL
    <%_ } _%>
    <%_ if (eureka) { _%>
    await eureka.shutdown_event()
    <%_ } _%>
    logger.info("Shutting down...")

app = FastAPI(lifespan=lifespan)


origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=SERVER_PORT, reload=True)
