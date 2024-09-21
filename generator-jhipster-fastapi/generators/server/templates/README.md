# <%= baseName %> prototype

This is a fastapi prototype generated using WeDAA, you can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- python version >= 3
<%_ if (auth && eureka) { _%>
- For Keycloak to work with Service Discovery in local(docker) environment, following line must be added to your hosts file `/etc/hosts`
  ```
  127.0.0.1	keycloak
  ```
<%_ } _%>

## Project Structure



## Get Started

1. Create a new virtual env  
```
python -m venv .venv
```

2. Activate the virtual environment
```
source .venv/bin/activate
```

3. Install the requirements for project
```
pip install -r requirements.txt
```

4. Run the application
```
python3 app/main.py
```

## Run the application in DEV Mode

cd app/

```
uvicorn main:app --port=9001 --reload
```

OR

```
python3 app/main.py
```

## Run the application in Dev using gunicorn

```
gunicorn main:app --workers 5 --worker-class uvicorn.workers.UvicornWorker --bind localhost:<%= serverPort %>
```

NOTE:
1) --workers <int> :Number of worker processes.
2) --worker flag will be ignored when using with --reload flag.