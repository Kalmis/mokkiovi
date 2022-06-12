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
CREATE ROLE mokkiovi WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD 'OlenOmena1';
````
2. Create DB
````
CREATE DATABASE mokkiovi_dev
    WITH
    OWNER = mokkiovi
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
````