from typing import List, Optional
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.config.db import get_session
from src.config import RedisService
from src.models import User

from .utils import decode_access_token
from sqlmodel.ext.asyncio.session import AsyncSession
from .service import AuthService
from src.common.errors import (
    AccountNotVerified,
    InvalidToken,
    RevokedToken,
    AccessTokenRequired,
    RefreshTokenRequired,
    InsufficientPermission,
)


auth_service = AuthService()

redis_service = RedisService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(
        self, request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        creds: HTTPAuthorizationCredentials = await super().__call__(request)

        if creds.scheme.lower() != "bearer":
            raise InvalidToken()

        if not self.token_is_valid(creds.credentials):
            raise InvalidToken()
        token_data = decode_access_token(creds.credentials)

        in_blocklist = redis_service.token_in_blocklist(jti=token_data["jti"])

        if in_blocklist:
            raise RevokedToken()

        self.verify_token(token_data)

        return token_data

    def verify_token(self, token_data: dict) -> None:
        raise NotImplementedError("Subclasses must implement this method")

    def token_is_valid(self, token: str) -> bool:
        payload = decode_access_token(token)
        return payload is not None


class AcessTokenBearer(TokenBearer):
    def verify_token(self, token_data: dict) -> None:

        if not token_data:
            raise InvalidToken()
        
        if token_data["isTemp"]:
            raise AccessTokenRequired()
        
        if token_data and token_data["refresh"]:
            raise AccessTokenRequired()


class RefreshTokenBearer(TokenBearer):
    def verify_token(self, token_data: dict) -> None:

        if not token_data:
            raise InvalidToken()
        
        if token_data["isTemp"]:
            raise AccessTokenRequired()

        if not token_data["refresh"]:
            raise RefreshTokenRequired()
        
class TempTokenBearer(TokenBearer):
    def verify_token(self, token_data: dict) -> None:

        if not token_data:
            raise InvalidToken()
        
        if not token_data["isTemp"]:
            raise InvalidToken()


async def get_current_user(
    token_data: dict = Depends(AcessTokenBearer()),
    session: AsyncSession = Depends(get_session),
) -> dict:
    user_email = token_data["user"]["email"]

    user = await auth_service.get_user_by_email(user_email, session)

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, user: User = Depends(get_current_user)) -> dict:

        if not user.is_email_verified:
            raise AccountNotVerified()

        if user.role not in self.allowed_roles:
            raise InsufficientPermission()

        return user
