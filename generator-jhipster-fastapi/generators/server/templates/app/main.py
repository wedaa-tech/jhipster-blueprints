from dotenv import load_dotenv
load_dotenv()
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
import asyncio
<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
from core.rabbitmq.rabbitmq_producer import send_message_to_queue
import asyncio
<%_ } _%><%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
from core.rabbitmq.rabbitmq_consumer import RabbitMQConsumer
import asyncio
<%_ } _%>

SERVER_PORT = int(os.getenv("SERVER_PORT", <%= serverPort != null ? serverPort : 9000 %>))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
async def send_message(queue_name, message):
    while True:
        await send_message_to_queue(queue_name, message)
        await asyncio.sleep(10)
<%_ } _%>



@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FastAPI application.")
    <%_ if (mongodb){  _%>
    await mongodb.connect_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.connect_postgresql()
    <%_ } _%>
<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
    # Get the list of queue names from environment variables
    queue_names = os.getenv("CONSUME_QUEUES").split(',')

    # Create a list to hold the consumer instances
    consumers = []

    # Get the current running loop
    loop = asyncio.get_event_loop()
    
    # Create an instance of RabbitMQConsumer for each queue and start them
    for queue_name in queue_names:
        consumer = RabbitMQConsumer(queue_name=queue_name, process_callable=log_incoming_message)
        consumers.append(consumer)
        task = loop.create_task(consumer.consume(loop))
    <%_ } _%>   

    yield 

    <%_ if (mongodb){  _%>
    await mongodb.disconnect_mongodb()
    <%_ } _%>
    <%_ if (postgresql){  _%>
    await postgres.disconnect_postgresql()
    <%_ } _%>
<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
    # Close all consumers
    for consumer in consumers:
        await consumer.close()
<%_ } _%>  
    logger.info("Stopping FastAPI application.")

<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
def log_incoming_message(message: dict):
    """Handle incoming message data"""
    logger.info("Processed incoming message: %s", message)
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
