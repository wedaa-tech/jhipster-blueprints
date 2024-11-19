import uuid
import pika
import json
import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

RABBIT_MQ_USER = os.getenv("RABBIT_MQ_USER")
RABBIT_MQ_PASSWORD = os.getenv("RABBIT_MQ_PASSWORD")
RABBIT_MQ_HOST = os.getenv("RABBIT_MQ_HOST")
RABBIT_MQ_PORT = int(os.getenv("RABBIT_MQ_PORT"))

class RabbitMQProducer:
    def __init__(self, publish_queue_name, process_callable=None):
        credentials = pika.PlainCredentials(RABBIT_MQ_USER, RABBIT_MQ_PASSWORD)
        self.publish_queue_name = publish_queue_name
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBIT_MQ_HOST, port=RABBIT_MQ_PORT, credentials=credentials, heartbeat=150)
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.publish_queue_name)
        self.process_callable = process_callable
        logger.info(f'RabbitMQClient initialized for queue: {self.publish_queue_name}')
    
    def send_message(self, message: dict):
        self.channel.basic_publish(
            exchange='',
            routing_key=self.publish_queue_name,
            properties=pika.BasicProperties(
                reply_to=self.publish_queue_name,
                correlation_id=str(uuid.uuid4())
            ),
            body=json.dumps(message)
        )
        logger.info(f"Message sent to queue {self.publish_queue_name}: {message}")
        logger.info(f':::')
    
    def close(self):
        """Close the RabbitMQ connection."""
        if self.connection and self.connection.is_open:
            self.connection.close()
            logger.info(f'RabbitMQ connection closed for queue: {self.publish_queue_name}')


# Factory to manage RabbitMQClient instances
class RabbitMQClientClientFactory:
    _clients = {}

    @classmethod
    def get_client(cls, queue_name):
        if queue_name not in cls._clients:
            cls._clients[queue_name] = RabbitMQProducer(publish_queue_name=queue_name)
            logger.info(f'PikaClient instance created for queue: {queue_name}')
        return cls._clients[queue_name]
    
    @classmethod
    def close_all_clients(cls):
        """Close all RabbitMQ clients."""
        for client in cls._clients.values():
            client.close()
        cls._clients.clear()  # Clear the client cache

async def send_message_to_queue(queue_name, message):
    pika_client = RabbitMQClientClientFactory.get_client(queue_name)  # Get cached client for the queue
    pika_client.send_message(message)