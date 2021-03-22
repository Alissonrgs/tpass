# third party
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from mangum import Mangum
from motor.motor_asyncio import AsyncIOMotorClient

# project
from api import settings
from api.routers import accounts_router
from api.routers import passwords_router

# settings
app = FastAPI()

# routers
app.include_router(accounts_router, prefix="/api")
app.include_router(passwords_router, prefix="/api")

# middlewares
app.add_middleware(TrustedHostMiddleware,
                   allowed_hosts=settings.ALLOWED_HOSTS)

app.add_middleware(CORSMiddleware,
                   allow_origins=settings.ALLOWED_ORIGINS,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
    app.mongodb = app.mongodb_client[settings.DB_NAME]


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


handler = Mangum(app)
