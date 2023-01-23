from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import models
from .config import ALGORITHM, SECRET_KEY
from .crud import get_user
from .database import SessionLocal
from .schemas import TokenData

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer("token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user_token(token: str = Depends(oauth2_scheme)) -> TokenData:  # noqa: B008
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenData(user_id=payload["sub"])
        return token_data
    except (JWTError, KeyError) as e:
        print(e)
        raise credentials_exception


def get_current_user(
    db: Session = Depends(get_db), current_user_token: TokenData = Depends(get_current_user_token)
) -> models.User:  # noqa: B008
    user = get_user(db, current_user_token.user_id)
    return user
