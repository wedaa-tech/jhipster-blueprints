from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn
from api.router_config import api_router
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

load_dotenv()
# generate some text

SERVER_PORT = int(os.getenv("SERVER_PORT", <%= serverPort != null ? serverPort : 9001 %>))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FastAPI application.")
    <%_ if (mongodb){  _%>
    await mongodb.connect_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.connect_postgresql()
    <%_ } _%>

    yield 
    logger.info("Stopping FastAPI application.")
    <%_ if (mongodb){  _%>
    await mongodb.disconnect_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.disconnect_postgresql()
    <%_ } _%>

app = FastAPI(lifespan=lifespan)


origins = [
    "*", # This configuration is intended for development purpose, it's **your** responsibility to harden it for production
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
    uvicorn.run("main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)
