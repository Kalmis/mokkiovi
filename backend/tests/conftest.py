from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from jose import jwt
from main import app
import pytest

from api.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from api.schemas import RolesEnum, TokenData


@pytest.fixture
def app_client() -> TestClient:
    client = TestClient(app)
    return client


@pytest.fixture
def app_client_admin(app_client: TestClient) -> TestClient:
    encoded_jwt = _create_jwt(RolesEnum.ADMIN)
    app_client.headers = {"Authorization": f"Bearer {encoded_jwt}"}
    return app_client


@pytest.fixture
def app_client_normal(app_client: TestClient) -> TestClient:
    encoded_jwt = _create_jwt(RolesEnum.NORMAL)
    app_client.headers = {"Authorization": f"Bearer {encoded_jwt}"}
    return app_client


@pytest.fixture
def app_client_guest(app_client: TestClient) -> TestClient:
    encoded_jwt = _create_jwt(RolesEnum.GUEST)
    app_client.headers = {"Authorization": f"Bearer {encoded_jwt}"}
    return app_client


def _create_jwt(role: RolesEnum):
    token_data = TokenData(
        sub=str(1),
        given_name="Test",
        family_name="User",
        role=role,
    )
    to_encode = token_data.dict()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
