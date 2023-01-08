## Dev environment

Requirements:
* VS Code
* Python 3.9
* Enable venv and install dev-requirements

## Run migrations

`alembic upgrade head`

## Run test server

1. Create a copy of the dev env files `cp dev.env.example dev.env`
2. Take env variables into use `set -a && . ./dev.env && set +a`
3. Start the fastapi server in  `backend` folder with hot refresh `uvicorn main:app --port 8000 --reload`