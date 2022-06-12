## Dev environment

Requirements:
* VS Code
* Azure Functions Core Tools (https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python)
* Python 3.9
* Enable venv and install dev-requirements
* Copy `local.settings.json.example` file as `local.settings.json`

## DB

Postgres 13

1. Create login
````
CREATE ROLE mokkiovi_dev WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD 'OlenOmena1';
````
2. Might be needed if commands are not ran as postgres
```
GRANT mokkiovi_dev TO <your_user_name>;
```
3. Create DB
````
CREATE DATABASE mokkiovi_dev
    WITH
    OWNER = mokkiovi_dev
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
````