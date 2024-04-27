
FROM  python:3.9-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file to leverage Docker cache
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the entire application code to the container
COPY . .

# Set the working directory to the app folder
WORKDIR /app/app

# Command to run the application using uvicorn
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

# Command to run the application using Gunicorn 
CMD ["gunicorn", "main:app", "--workers", "10", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:80", "--timeout", "300"]
