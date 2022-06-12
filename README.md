# mokkiovi

Mokkiovi is the the personal assistant for visiting and maintaining a Mökki. It helps you step-by-step when arriving at the Mökki after the winter, helps you to find the tool you are looking for, and keeps the calendar up-to-date.

## Tech stack

Frontend: React (Typescript) hosted via netlify
Backend: FastAPI hosted via Azure functions
CI/CD: Github actions (tests, backend deployment) & Netlify (frontend deployment)

## URLs

### Production

* Backend: https://mokkiovi.azurewebsites.net/
* Frontend: https://mokkiovi.netlify.app/

### Test

* Backend: https://mokkiovi-test.azurewebsites.net/
* Frontend: PR Specific environment, see PR for the link


### Dev / Test environemnt setup

#### Database

Database users were created with the following SQL, due to problems with setting up AD login
````
CREATE USER "mokkiovi" WITH PASSWORD='';
ALTER ROLE db_datareader ADD MEMBER "mokkiovi";
ALTER ROLE db_datawriter ADD MEMBER "mokkiovi";
ALTER ROLE db_ddladmin ADD MEMBER "mokkiovi";
````