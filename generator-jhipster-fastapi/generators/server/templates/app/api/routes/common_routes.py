from fastapi import APIRouter, Depends
<%_ if (auth) {  _%>
from core.auth import get_auth
<%_ } _%>
from services.app_details import fetch_app_details

router = APIRouter()


@router.get(
    "/api/app-details",
<%_ if (auth) {  _%>
    dependencies=[Depends(get_auth)],
<%_ } _%>
)
def get_app_details():
    app_details = fetch_app_details()
    return app_details

