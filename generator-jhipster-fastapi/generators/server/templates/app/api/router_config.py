from fastapi import APIRouter
from api.routes import (
    management_routes,
    common_routes,
)
<%_ if (eureka) { _%>
from core import eureka
<%_ } _%>


api_router = APIRouter()


api_router.include_router(management_routes.router, tags=["management-endpoints"])
api_router.include_router(common_routes.router, tags=["common-endpoints"])
<%_ if (eureka) { _%>
api_router.include_router(eureka.router, tags=["eureka-endpoints"])
<%_ } _%>