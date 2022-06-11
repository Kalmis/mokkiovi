import logging
import azure.functions as func

from datetime import datetime, timedelta

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from jose import JWTError, jwt
from pydantic import BaseModel
import fastapi
from typing import Union
from google.oauth2 import id_token
from google.auth.transport import requests

app = fastapi.FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer("token")


def get_name(name):
    return {
        "name": name,
    }


class Token(BaseModel):
    access_token: str
    token_type: str
    name: str


class TokenData(BaseModel):
    username: Union[str, None] = None


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logging.info("WADAP")
        logging.info(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = "test"
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.get("/users/me/")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return current_user


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": "test"}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


class GoogleToken(BaseModel):
    id_token: str


@app.post("/token/google", response_model=Token)
async def login_for_access_token_with_google(
    google_token: GoogleToken,
):
    CLIENT_ID = "264927455960-l6oe17fmcga9hbck8u5vmjkdr3rpt97i.apps.googleusercontent.com"
    idinfo = id_token.verify_oauth2_token(google_token.id_token, requests.Request(), CLIENT_ID)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": "test"}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "name": idinfo["name"]}


def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)
