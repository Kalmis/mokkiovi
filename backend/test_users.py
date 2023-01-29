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
def authenticated_app_client(app_client: TestClient) -> TestClient:
    token_data = TokenData(
        sub=str(1),
        given_name="Test",
        family_name="User",
        role=RolesEnum.ADMIN,
    )
    to_encode = token_data.dict()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    app_client.headers = {"Authorization": f"Bearer {encoded_jwt}"}
    return app_client


class TestUsersApi:
    def test_get_all_users(self, authenticated_app_client: TestClient):
        client = authenticated_app_client
        response = client.get("/users")
        assert response.status_code == 200

    def test_get_all_users_error(self, app_client: TestClient):
        client = app_client
        response = client.get("/users")
        assert response.status_code == 401
