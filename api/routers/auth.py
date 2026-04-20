from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from middleware.auth import get_current_user
from services.db import get_connection, release_connection

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
def me(current_user: Annotated[dict, Depends(get_current_user)]):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, image, "createdAt"
                FROM "User"
                WHERE email = %s
                """,
                (current_user["email"],),
            )
            row = cur.fetchone()
    finally:
        release_connection(conn)

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    col_names = ["id", "name", "email", "image", "createdAt"]
    return dict(zip(col_names, row))
