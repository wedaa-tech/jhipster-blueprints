from dotenv import load_dotenv
import pika
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBIT_USER = os.getenv("RABBIT_USER")
RABBIT_PS = os.getenv("RABBIT_PS")
PIKA_HOST = os.getenv("PIKA_HOST", "127.0.0.1")
PIKA_PORT = int(os.getenv("PIKA_PORT", 5672))


class RabbitMQConsumer:
    def __init__(self, exchange_name, queue_name, binding_key, username=RABBIT_USER, password=RABBIT_PS):
        logger.info("Initializing RabbitMQConsumer...")
        credentials = pika.PlainCredentials(username, password)

        try:
            self.connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=PIKA_HOST,
                    port=PIKA_PORT,
                    credentials=credentials
                )
            )
            logger.info("Connection established to RabbitMQ")
        except Exception as e:
            logger.error(f"Error connecting to RabbitMQ: {e}")
            raise

        self.channel = self.connection.channel()
        self.exchange_name = exchange_name
        self.queue_name = queue_name
        self.binding_key = binding_key

        # Declare the exchange
        self.channel.exchange_declare(exchange=exchange_name, exchange_type='direct')

        # Declare the queue
        self.channel.queue_declare(queue=queue_name, durable=True)

        # Bind the queue to the exchange with the specified binding key
        self.channel.queue_bind(exchange=exchange_name, queue=queue_name, routing_key=binding_key)

        logger.info(f' [*] Waiting for messages in {queue_name}. To exit press CTRL+C')

    def callback(self, ch, method, properties, body):
        try:
            message = body.decode()
            logger.info(f"Received message: {message}")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
        # Acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def start_consuming(self):
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=self.queue_name, on_message_callback=self.callback)
        self.channel.start_consuming()
