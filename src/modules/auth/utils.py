import logging
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from src.config.settings import Config
import uuid

pwd_context = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_EXPIRY = 1
REFRESH_TOKEN_EXPIRY = 2


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, refresh: bool = False, isTemp: bool = False) -> str:
    expiry = (
        datetime.now() + timedelta(minutes=10)
        if isTemp
        else datetime.now()
        + timedelta(days=REFRESH_TOKEN_EXPIRY if refresh else ACCESS_TOKEN_EXPIRY)
    )
    token = jwt.encode(
        payload={
            "exp": expiry,
            "user": data,
            "jti": str(generate_uuid()),
            "session_id": data.get("session_id"),
            "refresh": refresh,
            "isTemp": isTemp,
        },
        key=Config.JWT_SECRET,
        algorithm=Config.JWT_ALGORITHM,
    )

    return token


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(
            jwt=token, key=Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM]
        )
    except jwt.PyJWTError as e:
        logging.exception(e)
        return None

def generate_uuid():
    return uuid.uuid4()