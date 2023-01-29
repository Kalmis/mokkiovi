from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..crud import get_users
from ..dependencies import get_current_user_token, get_db
from ..models import RolesEnum
from ..schemas import TokenData, Users

router = APIRouter()


@router.get("/users", response_model=Users)
async def read_users_me(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_current_user_token),  # noqa: B008
):
    print(token_data.role)
    if token_data.role == RolesEnum.ADMIN:
        print("Beautifl")
    return get_users(db)
