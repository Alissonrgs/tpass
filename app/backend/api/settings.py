import os

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY", "3f131bdb19316b1c1fb556f0b21484ba86a6191b531a07961e37fc428b70b406")

ALLOWED_HOSTS = ["localhost"]
ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://localhost:3000"]

DB_NAME = os.getenv("MONGO_DB_NAME", "tpassdb")
DB_USER = os.getenv("MONGO_DB_USER", "tpass")
DB_PASS = os.getenv("MONGO_DB_PASS", "tpass")
DB_HOST = os.getenv("MONGO_DB_HOST", "localhost")
DB_URL = f"mongodb://{DB_HOST}/{DB_NAME}"
# DB_URL = f"mongodb://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}?retryWrites=true&w=majority"

# JWT
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
