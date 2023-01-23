from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_google_sub(db: Session, google_sub: str) -> models.User:
    return db.query(models.User).filter(models.User.google_sub == google_sub).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(
        email=user.email,
        picture_url=user.picture_url,
        given_name=user.given_name,
        family_name=user.family_name,
        google_sub=user.google_sub,
    )
    db.add(db_user)

    if user.role:
        db_user_roles = models.UserRole(
            user=db_user, role=user.role, valid_from=user.valid_from, valid_until=user.valid_until
        )
        db.add(db_user_roles)
    db.commit()
    db.refresh(db_user)
    return db_user
