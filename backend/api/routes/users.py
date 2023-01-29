from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud
from ..dependencies import get_current_user_token, get_db
from ..models import RolesEnum
from ..schemas import TokenData, Users

router = APIRouter()


@router.get("/users", response_model=Users)
def get_users(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_current_user_token),  # noqa: B008
):
    if token_data.role == RolesEnum.GUEST:
        raise HTTPException(status_code=403, detail="Guest is not allowed to fetch users")
    return crud.get_users(db)
