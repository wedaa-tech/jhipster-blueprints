"""Gunicorn config file. [Development]

by WeDAA (https://www.wedaa.tech/)

# Gunicorn (v21) Configuration File
# Reference - https://docs.gunicorn.org/en/latest/settings.html
#
# To run gunicorn by using this config, run gunicorn by passing
# config file path, ex:
#
#       $ gunicorn -c=gunicorn_dev_config.py main:app
#
"""
<%_ if (eureka) { _%>
import asyncio
from core import eureka
<%_ } _%><%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
import asyncio
import logging
import os
import signal
from main import send_message
<%_ } _%><%_ if (mongodb || postgresql){  _%>
import asyncio
from dotenv import load_dotenv
load_dotenv()
<%_ } _%><%_ if (mongodb){  _%>
from core.mongodb import run_migrations
<%_ } _%><%_ if (postgresql){  _%>
from core.postgres import run_migrations
<%_ } _%>

<%_ if (mongodb || postgresql){  _%>
async def async_migration():
    """Run migrations asynchronously when the server is ready."""
    await run_migrations()
<%_ } _%>

# ===============================================
#           Server Socket
# ===============================================

# bind - The server socket to bind
bind = "0.0.0.0:<%= serverPort != null ? serverPort : 9000 %>" 

# ===============================================
#           Worker Processes
# ===============================================
workers = 2 
worker_class = "uvicorn.workers.UvicornWorker"


# ===============================================
#           Debugging
# ===============================================

# reload - Restart workers when code changes
reload = True

# ===============================================
#           Logging
# ===============================================

# loglevel - The granularity of Error log outputs.
# Valid level names are:
    # 1. debug
    # 2. info
    # 3. warning
    # 4. error
    # 5. critical

loglevel = 'info'

<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
# ===============================================
#           RabbitMQ Producer util
# ===============================================
async def send_messages_concurrently():
    try:
        <%_ for (let i = 0; i < rabbitmqClient.length; i++) { _%>
        task<%= i + 1 %> = asyncio.create_task(
                send_message("<%= baseName %>_<%= rabbitmqClient[i] %>", {"producer": "<%= baseName %>", "consumer": "<%= rabbitmqClient[i] %>"})
            )
        <%_ } _%>
        
        # Wait for all tasks to finish
        await asyncio.gather(<%_ for (let i = 0; i < rabbitmqClient.length; i++) { _%>task<%= i + 1 %><%= i + 1 < rabbitmqClient.length ? ', ' : '' %><%_ } _%>)
    except Exception as e:
        logging.error(f"Error during startup: {e}")
<%_ } _%>


# ===============================================
#           Server Hooks
# ===============================================

def on_starting(server):
    """
    Execute code just before the main process is initialized.
    """
    <%_ if (eureka) { _%>
    asyncio.run(eureka.startup_event())
    <%_ } _%>
    <%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
    loop = asyncio.new_event_loop()  # Create a new event loop
    asyncio.set_event_loop(loop)  # Set it as the current event loop
    loop.run_until_complete(send_messages_concurrently())
    loop.close()  # Close the loop after the task is done
    <%_ } _%>
    <%_ if (mongodb || postgresql){  _%>
    server.log.info("Running migrations...")
    asyncio.run(async_migration())
    server.log.info("Migrations completed.")
    <%_ } _%>

def when_ready(server):
    """
    Execute code just after the server is started.
    """
    server.log.info("Server is ready. Spawning workers")

def on_exit(server):
    """
    Execute code just before exiting gunicorn.
    """
    <%_ if (eureka) { _%>
    asyncio.run(eureka.shutdown_event())
    <%_ } _%>

<%_ if (rabbitmqClient != null && rabbitmqClient.length) { _%>
def handle_signal(signum, frame):
    """
    Handle signals like SIGINT and SIGTERM.
    """
    logging.info("Signal received, exiting immediately.")
    os._exit(0)  # Exit immediately on signal

# Register signal handlers
signal.signal(signal.SIGINT, handle_signal)
signal.signal(signal.SIGTERM, handle_signal)
<%_ } _%>
