from fastapi import APIRouter, Depends

from middleware.auth import get_current_user

router = APIRouter(prefix="/agent", tags=["agent"])


# TODO: implement agent endpoints
