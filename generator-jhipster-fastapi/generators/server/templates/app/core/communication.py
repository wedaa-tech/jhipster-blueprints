import httpx
from fastapi import HTTPException, Request
import os

async def get_service_url(rest_server: str):
    # Retrieve the service URL from environment variables
    service_url = os.getenv(f"COMMUNICATION_{rest_server.upper()}")
    print(f"Retrieved service URL for {rest_server}: {service_url}")
    if not service_url:
        raise HTTPException(status_code=500, detail=f"Service URL not found for {rest_server}")
    return service_url + f"/api/app-details"

async def communicate_with_service(request: Request, rest_server: str, auth: bool = False):
    try:
        service_url = await get_service_url(rest_server)

        headers = {}
        if auth:
            auth_header = request.headers.get("Authorization")
            if auth_header:
                headers["Authorization"] = auth_header

        async with httpx.AsyncClient() as client:
            response = await client.get(service_url, headers=headers)
            response.raise_for_status()

            return response.json()

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with the service: {str(e)}")
