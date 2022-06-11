from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
)

from jose import JWTError, jwt

from .config import ALGORITHM, SECRET_KEY
from .schemas import TokenData

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer("token")


def get_current_user(token: str = Depends(oauth2_scheme)):  # noqa: B008
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = "test"
    return user
