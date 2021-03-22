# python
import uuid
from datetime import datetime
from typing import Optional

# third party
from pydantic import BaseModel
from pydantic import Field

# project
from .utils import unique_id_generator


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserForm(BaseModel):
    username: Optional[str] = None
    email: str
    password: str


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    created: Optional[datetime] = Field(default_factory=datetime.now)
    username: Optional[str] = None
    email: str
    full_name: Optional[str] = None
    active: Optional[bool] = True

    class Config:
        allow_population_by_field_name = True


class UserInDB(User):
    hashed_password: str


class Password(BaseModel):
    id: Optional[str] = Field(default_factory=unique_id_generator, max_length=50, alias="_id")
    created: Optional[datetime] = Field(default_factory=datetime.now)
    view: int
    expire: datetime

    class Config:
        allow_population_by_field_name = True


class PasswordInDB(Password):
    pwd: str = Field(..., max_length=255)
    hashed_cipher: Optional[str] = Field(..., max_length=255)


class PasswordForm(BaseModel):
    pwd: str = Field(..., max_length=255)
    view: int
    expire: datetime
    hashed_cipher: Optional[str] = Field(..., max_length=255)
