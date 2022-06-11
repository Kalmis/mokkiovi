from datetime import datetime, timedelta
from typing import Union

from fastapi import APIRouter, Depends
from fastapi.security import (
    OAuth2PasswordRequestForm,
)

from google.auth.transport import requests
from google.oauth2 import id_token

from jose import jwt

from ..config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, CLIENT_ID, SECRET_KEY
from ..dependencies import get_current_user
from ..schemas import GoogleToken, Token

router = APIRouter()


def _create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.get("/users/me/")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return current_user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):  # noqa: B008
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _create_access_token(data={"sub": "test"}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token/google", response_model=Token)
async def login_for_access_token_with_google(
    google_token: GoogleToken,
):
    idinfo = id_token.verify_oauth2_token(google_token.id_token, requests.Request(), CLIENT_ID)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _create_access_token(
        data={"sub": "test", "name": idinfo["name"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
