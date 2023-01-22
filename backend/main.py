import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import auth

app = FastAPI()
app.include_router(auth.router)

origins_raw = os.environ["BACKEND_ALLOWED_ORIGINS"]

origins = [origin for origin in origins_raw.split(";")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    # Give the app as an import string, so reload works
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
