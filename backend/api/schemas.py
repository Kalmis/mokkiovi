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
    role: RolesEnum


class UserCreate(UserBase):
    google_sub: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
