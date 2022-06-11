import logging
from datetime import datetime, timedelta
from typing import Union

from fastapi import APIRouter, Depends, HTTPException

from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests
from google.oauth2 import id_token


from jose import jwt

from sqlalchemy.orm import Session

from .. import models
from ..config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    CLIENT_ID,
    FIRST_ALLOWED_USER_EMAIL,
    SECRET_KEY,
)
from ..crud import create_user, get_user_by_google_sub
from ..dependencies import get_current_user, get_db
from ..schemas import GoogleToken, Token, User, UserCreate

router = APIRouter()


@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: models.User = Depends(get_current_user),  # noqa: B008
):
    return current_user


@router.post("/token/google", response_model=Token)
async def login_for_access_token_with_google(
    google_token: GoogleToken, db: Session = Depends(get_db)  # noqa: B008
):
    try:
        idinfo = id_token.verify_oauth2_token(google_token.id_token, requests.Request(), CLIENT_ID)
    except (ValueError, GoogleAuthError) as e:
        raise HTTPException(status_code=403, detail=str(e))

    try:
        user = get_user_by_google_sub(db, idinfo["sub"])
        access_token = _create_access_token(user)
        logging.info(f"login successful {user.id}")
        return {"access_token": access_token, "token_type": "bearer"}
    except AttributeError:
        logging.info(f"user not found with google sub {idinfo['sub']}")

    if not _is_allowed_email(idinfo["email"]):
        logging.info("user not allowed to login")
        raise HTTPException(status_code=401, detail="user not allowed to login")

    user = create_user(
        db,
        UserCreate(
            email=idinfo["email"],
            picture_url=idinfo["picture"],
            given_name=idinfo["given_name"],
            family_name=idinfo["family_name"],
            google_sub=idinfo["sub"],
        ),
    )
    access_token = _create_access_token(user)
    logging.info(f"user created {user.id}")
    return {"access_token": access_token, "token_type": "bearer"}


def _create_access_token(user: models.User, expires_delta: Union[timedelta, None] = None):
    data = {"sub": str(user.id), "given_name": user.given_name, "family_name": user.family_name}
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def _is_allowed_email(email: str) -> bool:
    return email == FIRST_ALLOWED_USER_EMAIL
