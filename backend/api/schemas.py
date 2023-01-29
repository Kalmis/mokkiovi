from datetime import datetime

from pydantic import BaseModel

from .models import RolesEnum


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: str
    given_name: str
    family_name: str
    role: RolesEnum

    class Config:
        use_enum_values = True


class TestLogin(BaseModel):
    username: str


class GoogleToken(BaseModel):
    id_token: str


class UserRoleBase(BaseModel):
    role: RolesEnum
    valid_from: datetime
    valid_until: datetime | None


class UserRole(UserRoleBase):
    user_id: int

    class Config:
        orm_mode = True


class UserRoleWithoutId(UserRoleBase):
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str
    picture_url: str
    given_name: str
    family_name: str


class UserCreate(UserBase):
    google_sub: str
    role: RolesEnum | None
    valid_from: datetime | None
    valid_until: datetime | None = None


class User(UserBase):
    id: int
    roles: list[UserRoleWithoutId]

    class Config:
        orm_mode = True


class Users(BaseModel):
    __root__: list[User]
