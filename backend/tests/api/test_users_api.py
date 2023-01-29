from fastapi.testclient import TestClient


class TestUsersApi:
    def test_get_all_users(self, app_client_normal: TestClient):
        client = app_client_normal
        response = client.get("/users")
        assert response.status_code == 200

    def test_get_all_users_guest_403(self, app_client_guest: TestClient):
        client = app_client_guest
        response = client.get("/users")
        assert response.status_code == 403

    def test_get_all_users_error(self, app_client: TestClient):
        client = app_client
        response = client.get("/users")
        assert response.status_code == 401
