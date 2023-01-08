FROM python:3.11-slim-bullseye as mokkiovi-build

RUN groupadd -r mokkiovi && useradd --no-log-init -r -g mokkiovi mokkiovi

# Install OS updates and packages as root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl

# Install pip packages for the user used to run mokkiovi
COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    pip install gunicorn

EXPOSE 8000

ENTRYPOINT []
CMD ["/bin/bash", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]

FROM mokkiovi-build AS mokkiovi

COPY --chown=mokkiovi:0 . /app/mokkiovi
WORKDIR /app/mokkiovi

USER mokkiovi

FROM mokkiovi-build AS mokkiovi-test

COPY test-requirements.txt /tmp/test-requirements.txt
RUN pip install --no-cache-dir -r /tmp/test-requirements.txt

COPY --chown=mokkiovi:0 .  /app/mokkiovi
WORKDIR /app/mokkiovi

USER mokkiovi
