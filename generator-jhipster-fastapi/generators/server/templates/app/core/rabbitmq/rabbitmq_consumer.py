import os
import json
import logging
from dotenv import load_dotenv
from aio_pika import connect_robust, IncomingMessage

load_dotenv()
logger = logging.getLogger(__name__)

RABBIT_MQ_HOST = os.getenv("RABBIT_MQ_HOST")
RABBIT_MQ_PORT = int(os.getenv("RABBIT_MQ_PORT"))
RABBIT_MQ_USER = os.getenv("RABBIT_MQ_USER")
RABBIT_MQ_PASSWORD = os.getenv("RABBIT_MQ_PASSWORD")

class RabbitMQConsumer:
    def __init__(self, queue_name, process_callable=None):
        self.queue_name = queue_name
        self.process_callable = process_callable
        self.connection = None
        self.channel = None

    async def consume(self, loop):
        try:
            self.connection = await connect_robust(
                host=RABBIT_MQ_HOST,
                port=RABBIT_MQ_PORT,
                login=RABBIT_MQ_USER,
                password=RABBIT_MQ_PASSWORD,
                loop=loop
            )
            self.channel = await self.connection.channel()
            await self.channel.set_qos(prefetch_count=1)
            queue = await self.channel.declare_queue(self.queue_name, durable=False)

            await queue.consume(self.process_incoming_message)
            logger.info(f"Established RabbitMQ listener on queue: {self.queue_name}")

        except Exception as e:
            logger.error(f"Failed to connect or consume messages: {e}")

    async def process_incoming_message(self, message: IncomingMessage):
        try:
            async with message.process():
                body = message.body
                if body and self.process_callable:
                    self.process_callable(json.loads(body))
        except Exception as e:
            logger.error(f"Failed to process message: {e}")
    
    async def close(self):
        """Gracefully close the RabbitMQ connection and channel"""
        if self.channel:
            await self.channel.close()
        if self.connection:
            await self.connection.close()