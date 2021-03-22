# python
from datetime import datetime
from datetime import timedelta
from typing import List

# third party
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from pymongo import DESCENDING

# project
from . import settings
from .dependencies import authenticate_user
from .dependencies import create_access_token
from .dependencies import get_current_active_user
from .dependencies import get_password_hash
from .dependencies import PWD_ID_PATH
from .models import Password
from .models import PasswordForm
from .models import PasswordInDB
from .models import Token
from .models import User
from .models import UserForm
from .models import UserInDB
from .utils import decrypt
from .utils import encrypt

accounts_router = APIRouter(tags=["accounts"])
passwords_router = APIRouter(prefix="/passwords", tags=["passwords"])


# accounts

@accounts_router.post("/token", response_model=Token)
async def access_token_create(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(request.app.mongodb, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@accounts_router.post("/users/create", response_model=User, status_code=status.HTTP_201_CREATED)
async def users_create(request: Request,
                       user: UserForm):
    """
    Create a new user
    """
    user = UserInDB(**user.dict(), hashed_password=get_password_hash(user.password))
    new_user = await request.app.mongodb["users"].insert_one(jsonable_encoder(user))
    return await request.app.mongodb["users"].find_one({"_id": new_user.inserted_id})


@accounts_router.get("/users/current", response_model=User)
async def users_current(current_user: User = Depends(get_current_active_user)):
    return current_user


# passwords

@passwords_router.get("/", response_model=List[Password])
async def passwords_list(request: Request,
                         current_user: User = Depends(get_current_active_user)):
    """
    Returns a list of details of passwords that have not yet expired

    permission: authenticated
    """
    pwd_query = await request.app.mongodb["passwords"] \
        .find() \
        .sort("created", DESCENDING) \
        .to_list(length=20)

    pwd_list = []
    for pwd in pwd_query:
        pwd = Password(**pwd)
        if pwd.expire.isoformat() >= datetime.utcnow().isoformat():
            pwd_list.append(pwd)
    return pwd_list


@passwords_router.post("/create", response_model=Password, status_code=status.HTTP_201_CREATED)
async def passwords_create(request: Request,
                           password: PasswordForm):
    """
    Create a password with all the information:

    - **pwd**: the password
    - **view**: limit amount of views
    - **expire**: the date and time when the password expires
    - **hashed_cipher**: the encryption cipher hash

    permission: any
    """
    password = PasswordInDB(**password.dict())
    password.pwd = encrypt(password.pwd)

    new_password = await request.app.mongodb["passwords"].insert_one(jsonable_encoder(password))
    new_password = await request.app.mongodb["passwords"].find_one({"_id": new_password.inserted_id})
    return Password(**new_password)


@passwords_router.get("/{pwd_id}", response_model=PasswordInDB)
async def passwords_detail(request: Request,
                           pwd_id: str = PWD_ID_PATH):
    """
    Returns an encrypted password that has not yet expired

    permission: any user with the link and encryption key
    """
    pwd_find = {"_id": pwd_id}
    pwd_exception = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Password not found or expired")

    if (password := await request.app.mongodb["passwords"].find_one(pwd_find)) is None:
        raise pwd_exception

    password = PasswordInDB(**password)
    if password.view == 0 or password.expire.isoformat() < datetime.utcnow().isoformat():
        raise pwd_exception

    # decrement view and decrypt password
    password.view -= 1
    password.pwd = decrypt(password.pwd)

    # save amount of view remaining
    request.app.mongodb["passwords"].update_one(pwd_find, {"$set": {"view": password.view}})

    return password
