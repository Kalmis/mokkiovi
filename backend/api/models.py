from datetime import datetime
import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class RolesEnum(str, enum.Enum):
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
    is_active = Column(Boolean, default=True, nullable=False)

    roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")

    def current_role(self) -> RolesEnum | None:
        current_time = datetime.utcnow()
        for role in self.roles:
            role: UserRole
            if current_time >= role.valid_from and (
                not role.valid_until or current_time < role.valid_until
            ):
                return role.role
        return None


class UserRole(Base):

    __tablename__ = "user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(Enum(RolesEnum), nullable=False)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="roles")
