import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

_NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET", "")
_INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET", "")
_ALGORITHM = "HS256"

bearer_scheme = HTTPBearer(auto_error=False)


def _auth_internal(request: Request) -> dict | None:
    """
    Method A — server-to-server from Next.js.
    Trusts the session data passed in headers after verifying the shared secret.
    """
    secret = request.headers.get("x-internal-secret")
    if not secret or not _INTERNAL_SECRET or secret != _INTERNAL_SECRET:
        return None

    user_id = request.headers.get("x-user-id", "").strip()
    email = request.headers.get("x-user-email", "").strip()

    if not user_id or not email:
        return None

    return {
        "id": user_id,
        "email": email,
        "name": request.headers.get("x-user-name", ""),
    }


def _auth_jwt(credentials: HTTPAuthorizationCredentials | None) -> dict | None:
    """
    Method B — direct HS256 JWT for future mobile / third-party clients.
    Returns None (rather than raising) so the caller can fall through to 401.
    """
    if credentials is None:
        return None

    try:
        from jose import JWTError, jwt

        payload = jwt.decode(credentials.credentials, _NEXTAUTH_SECRET, algorithms=[_ALGORITHM])
    except Exception:
        return None

    user_id: str | None = payload.get("sub") or payload.get("id")
    email: str | None = payload.get("email")

    if not user_id or not email:
        return None

    return {
        "id": user_id,
        "email": email,
        "name": payload.get("name") or "",
    }


def get_current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> dict:
    user = _auth_internal(request) or _auth_jwt(credentials)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
