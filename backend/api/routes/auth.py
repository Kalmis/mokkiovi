from datetime import datetime, timedelta
import logging
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
    TEST_USER,
)
from ..crud import create_user, get_user_by_google_sub
from ..dependencies import get_current_user, get_db
from ..schemas import GoogleToken, RolesEnum, TestLogin, Token, TokenData, User, UserCreate

router = APIRouter()


@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: models.User = Depends(get_current_user),  # noqa: B008
):
    return current_user


@router.post("/token/test", response_model=Token)
async def login_for_access_token_with_test_user(
    test_login: TestLogin, db: Session = Depends(get_db)  # noqa: B008
):
    """Endpoint for test environments where google sign in may not be used.
    Simply sending the correct username will let the user login
    """
    if len(TEST_USER) == 0:
        raise HTTPException(status_code=401, detail="test user not in use")
    if test_login.username != TEST_USER:
        logging.info(test_login.username)
        raise HTTPException(status_code=401, detail="invalid username")
    idinfo = {
        "sub": test_login.username,
        "email": "test@test_test_test.com",
        "picture": "",
        "given_name": "Teppo",
        "family_name": "Tester",
    }
    access_token = _handle_login(db, idinfo=idinfo, validate_allowed_email=False)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token/google", response_model=Token)
async def login_for_access_token_with_google(
    google_token: GoogleToken, db: Session = Depends(get_db)  # noqa: B008
):
    try:
        idinfo = id_token.verify_oauth2_token(google_token.id_token, requests.Request(), CLIENT_ID)
    except (ValueError, GoogleAuthError) as e:
        raise HTTPException(status_code=403, detail=str(e))
    access_token = _handle_login(db, idinfo=idinfo)
    return {"access_token": access_token, "token_type": "bearer"}


def _handle_login(db: Session, idinfo: dict, validate_allowed_email: bool = True) -> str:

    try:
        user = get_user_by_google_sub(db, idinfo["sub"])
        if not user.current_role():
            logging.info("user does not have role")
            raise HTTPException(status_code=401, detail="user not allowed to login")
        access_token = _create_access_token(user)
        logging.info(f"login successful {user.id}")
        return access_token
    except AttributeError:
        logging.info(f"user not found with google sub {idinfo['sub']}")

    if validate_allowed_email and not _is_first_allowed_email(idinfo["email"]):
        logging.info("user not allowed to login")
        raise HTTPException(status_code=401, detail="user not allowed to login")

    # Create the first user

    user = create_user(
        db,
        UserCreate(
            email=idinfo["email"],
            picture_url=idinfo["picture"],
            given_name=idinfo["given_name"],
            family_name=idinfo["family_name"],
            google_sub=idinfo["sub"],
            role=RolesEnum.ADMIN,
            valid_from=datetime.utcnow(),
        ),
    )
    access_token = _create_access_token(user)
    logging.info(f"user created {user.id}")
    return access_token


def _create_access_token(user: models.User, expires_delta: Union[timedelta, None] = None):
    token_data = TokenData(
        sub=str(user.id),
        given_name=user.given_name,
        family_name=user.family_name,
        role=user.current_role(),
    )
    print(user.current_role())
    to_encode = token_data.dict()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def _is_first_allowed_email(email: str) -> bool:
    return email == FIRST_ALLOWED_USER_EMAIL
