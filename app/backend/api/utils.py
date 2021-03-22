# python
import base64
import random
import string
from cryptography.fernet import Fernet

# project
from . import settings

CHARS = string.ascii_letters + string.digits


def random_string_generator(size: int = 50, chars: str = CHARS):
    return ''.join(random.choice(chars) for _ in range(size))


def unique_id_generator(new_id: str = None):
    if new_id is not None:
        _id = new_id
    else:
        _id = random_string_generator()

    # TODO checar se existe
    id_exists = False

    if id_exists:
        _id = unique_id_generator()
    return _id


def encrypt(data):
    secret = base64.b64encode(settings.SECRET_KEY[:32].encode())
    fernet = Fernet(secret)
    return fernet.encrypt(data.encode()).decode()


def decrypt(data):
    secret = base64.b64encode(settings.SECRET_KEY[:32].encode())
    fernet = Fernet(secret)
    return fernet.decrypt(data.encode()).decode()
