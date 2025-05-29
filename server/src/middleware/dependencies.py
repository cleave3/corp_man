from typing import List, Optional
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.config import RedisService
from src.models import Auth, User

from ..modules.auth.utils import decode_access_token
from src.modules.auth.service import AuthService, get_auth_service
from src.common.errors import (
    AccountRestricted,
    InvalidToken,
    RevokedToken,
    AccessTokenRequired,
    RefreshTokenRequired,
    InsufficientPermission,
)

redis_service = RedisService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    def get_authorization_scheme_param(
        self,
        authorization_header_value: Optional[str],
    ) -> Optional[HTTPAuthorizationCredentials]:
        if not authorization_header_value:
            return HTTPAuthorizationCredentials(scheme="", credentials="")
        scheme, _, param = authorization_header_value.partition(" ")
        return HTTPAuthorizationCredentials(scheme=scheme, credentials=param)

    async def __call__(self, request: Request) -> dict:
        authorization = request.headers.get("Authorization")
        creds: HTTPAuthorizationCredentials = self.get_authorization_scheme_param(
            authorization
        )

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

        print("Token Data:", token_data)

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
    auth_service: AuthService = Depends(get_auth_service),
) -> Auth:
    user = await auth_service.get_user_by_id(uid=token_data["user"]["uid"])

    if user.status != "active":
        raise AccountRestricted()

    if user.user_type not in {"user", "root"}:
        raise InsufficientPermission()

    return user


async def get_current_user_permissions(
    token_data: dict = Depends(AcessTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
) -> Auth:
    
    print("Token Data:", token_data)

    user = await auth_service.get_user_by_id(uid=token_data["user"]["uid"])

    if user.status != "active":
        raise AccountRestricted()

    user_profile = await auth_service.get_profile_by_uid(uid=token_data["user"]["uid"])

    return user_profile


async def get_current_admin(
    token_data: dict = Depends(AcessTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
) -> Auth:

    user = await auth_service.get_user_by_id(uid=token_data["user"]["uid"])

    if user.user_type != "admin":
        raise InsufficientPermission()

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, user: Auth = Depends(get_current_user)) -> Auth:

        if user.user_type not in self.allowed_roles:
            raise InsufficientPermission()

        return user


class PermissionChecker:
    def __init__(self, allowed_permissions: List[str]):
        self.allowed_permissions = allowed_permissions

    async def __call__(
        self, user: User = Depends(get_current_user_permissions)
    ) -> Auth:

        if not any(
            permission in self.allowed_permissions for permission in user.permissions
        ):
            raise InsufficientPermission()

        return user
