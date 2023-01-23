from datetime import datetime

from pydantic import BaseModel
from .models import RolesEnum


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: int


class TestLogin(BaseModel):
    username: str


class GoogleToken(BaseModel):
    id_token: str


class UserBase(BaseModel):
    email: str
    picture_url: str
    given_name: str
    family_name: str


class UserCreate(UserBase):
    google_sub: str
    role: RolesEnum | None
    valid_from: datetime | None
    valid_until: datetime | None


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
