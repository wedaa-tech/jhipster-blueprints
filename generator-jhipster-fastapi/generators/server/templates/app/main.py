from dotenv import load_dotenv

load_dotenv()

import os
from fastapi import FastAPI
import uvicorn
from api.main import api_router

# from core import db
from fastapi.middleware.cors import CORSMiddleware

# def startup_event():
#     """
#     Executes all startup events for the application.

#     This function is called when the application starts up to execute all necessary startup events,
#     including initializing services, and setting up configurations.

#     Raises:
#         Exception: If there is an error during any of the startup events.
#     """
#     db.connect_to_mongodb()
APP_NAME = os.getenv("APP_NAME")
APP_VERSION = os.getenv("APP_VERSION")
APP_DISCRIPTION = os.getenv("APP_DISCRIPTION")

app = FastAPI(title=APP_NAME, version=APP_VERSION, description=APP_DISCRIPTION)

origins = [
    # List of origins
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

# app.add_event_handler("startup", startup_event)
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=<%= serverPort %>, reload=True)



