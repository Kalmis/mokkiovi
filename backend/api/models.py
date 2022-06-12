from sqlalchemy import Boolean, Column, Integer, String

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    google_sub = Column(String, unique=True, index=True)
    picture_url = Column(String)
    given_name = Column(String)
    family_name = Column(String)
    is_active = Column(Boolean, default=True)
