import os

# Authentication
SECRET_KEY = os.environ["BACKEND_SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
CLIENT_ID = os.environ["BACKEND_GOOGLE_CLIENT_ID"]

# Database
SQLALCHEMY_DATABASE_URL = os.environ["SQLALCHEMY_DATABASE_URL"]

# First allowed username / email
FIRST_ALLOWED_USER_EMAIL = os.environ["FIRST_ALLOWED_USER_EMAIL"]

# Name of a user that is able to login without google sso in test environment
TEST_USER = os.getenv("TEST_USER", "")
