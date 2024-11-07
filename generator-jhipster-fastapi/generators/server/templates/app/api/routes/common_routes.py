from fastapi import APIRouter<%_ if (auth) {  _%>, Depends
<%_ } _%><%_ if (auth) {  _%>
from core.auth import get_auth
<%_ } _%>

from services.app_details import fetch_app_details
<%_ if (restServer?.length && !eureka && apiServers){ apiServers.forEach((appServer) =>  { _%>
from core.communication import communicate_with_service
from fastapi import Request
<%_ })} _%>

router = APIRouter()


@router.get(
    "/rest/services/<%= baseName %>",
<%_ if (auth) {  _%>
    dependencies=[Depends(get_auth)],
<%_ } _%>
)
def get_app_details():
    app_details = fetch_app_details()
    return app_details

<%_ if (restServer?.length && !eureka && apiServers){ apiServers.forEach((appServer) =>  { _%>
@router.get("/rest/services/<%= appServer.baseName %>")
async def communicate_<%= appServer.baseName %>(request: Request):
    response = await communicate_with_service(request, rest_server="<%= appServer.baseName %>")
    return response
<%_ })} _%>

