import enum

from sqlalchemy import Boolean, Column, Integer, String, Enum

from .database import Base


class RolesEnum(enum.Enum):
    # Note: The variable name is stored in DB; not value
    ADMIN = "Admin"
    NORMAL = "Normal"
    GUEST = "Guest"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    google_sub = Column(String, unique=True, index=True)
    picture_url = Column(String, nullable=True)
    given_name = Column(String, nullable=False)
    family_name = Column(String, nullable=False)
    role = Column(Enum(RolesEnum), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
