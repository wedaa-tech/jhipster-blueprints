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
<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
import asyncio                                
from core.rabbitmq.RabbitMQConsumer<%= rabbitmqServer[0][0].toUpperCase() + rabbitmqServer[0].slice(1) %>To<%= baseName[0].toUpperCase() + baseName.slice(1) %> import RabbitMQConsumer  # Adjust import as needed
<%_ } _%>
<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
from core.rabbitmq.RabbitMQProducer<%= baseName[0].toUpperCase() + baseName.slice(1) %>To<%= rabbitmqClient[0][0].toUpperCase() + rabbitmqClient[0].slice(1) %> import RabbitMQProducer
<%_ } _%>


SERVER_PORT = int(os.getenv("SERVER_PORT", <%= serverPort != null ? serverPort : 9000 %>))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
# Initialize RabbitMQ Consumer
consumer = RabbitMQConsumer(exchange_name='direct_logs', queue_name='data_queue', routing_key='pro_queue')
print("RabbitMQ Consumer initialized")
<%_ } _%>

<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
# Initialize RabbitMQ Producer
producer = RabbitMQProducer(exchange_name='direct_logs')
<%_ } _%>

<%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
# Async function to start the RabbitMQ consumer
async def start_consumer():
    """Run the RabbitMQ consumer in an asynchronous task."""
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, consumer.start_consuming)
<%_ } _%>


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FastAPI application.")
    <%_ if (rabbitmqServer != null && rabbitmqServer.length) { _%>
    asyncio.create_task(start_consumer())  # Start RabbitMQ consumer as a background task
    <%_ } _%>

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
