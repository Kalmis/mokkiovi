from typing import Optional, List

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: int


class GoogleToken(BaseModel):
    id_token: str


class UserBase(BaseModel):
    email: str
    picture_url: str
    given_name: str
    family_name: str


class UserCreate(UserBase):
    google_sub: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
