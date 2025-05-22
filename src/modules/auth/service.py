from datetime import datetime, timedelta
from user_agents import parse
from typing import List

from fastapi import Depends, Request, status
from src.common.enums import UserTypeEnum
from src.common.errors import (
    AccountNotVerified,
    InvalidCredentials,
    InvalidPassword,
    InvalidToken,
    UserAlreadyVerified,
    UserNotFound,
    UserAlreadyExists,
    UserPhoneAlreadyExists,
    AccountRestricted,
)
from src.config.db import get_session
from src.config.redis import RedisService
from src.firebase import verify_id_token
from src.models import Token, User, Auth, AuthMetaData
from .schemas import (
    EmailVerificationModel,
    PasswordResetConfirmModel,
    SocioAuthModel,
    SocioUserCreateModel,
    UserCreateModel,
)
from .utils import (
    create_access_token,
    decode_access_token,
    generate_uuid,
    get_password_hash,
    verify_password,
)

# from .utils import get_password_hash
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


class AuthService(RedisService):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_email(self, email: str) -> Auth | None:
        user = await self.session.exec(select(Auth).where(Auth.email == email))
        return user.first()

    async def get_user_by_phone(self, phone: str) -> Auth | None:
        user = await self.session.exec(select(Auth).where(Auth.phone == phone))
        return user.first()

    async def get_user_by_id(self, uid: str) -> Auth | None:
        user = await self.session.exec(select(Auth).where(Auth.uid == uid))
        return user.first()

    async def get_users_by_business_id(self, business_id: str) -> List[Auth]:
        users = await self.session.exec(
            select(Auth).where(Auth.business_id == business_id)
        )
        return users.fetchall()

    async def check_if_user_is_unique_user(self, email: str, phone: str) -> User | None:
        email_exist = await self.get_user_by_email(email=email)

        if email_exist:
            raise UserAlreadyExists()
        phone_exist = await self.get_user_by_phone(phone=phone)

        if phone_exist:
            raise UserPhoneAlreadyExists()

    async def get_profile_by_uid(self, uid: str) -> User | None:
        user = await self.session.exec(select(User).where(User.uid == uid))
        return user.first()

    async def user_exists(self, email: str) -> Auth | None:
        user = await self.get_user_by_email(email)
        return user

    async def create_user(
        self,
        business_id: str,
        user_data: UserCreateModel,
    ) -> Auth:

        email = user_data.email
        phone = user_data.phone

        await self.check_if_user_is_unique_user(email=email, phone=phone)

        user_data_dict = {
            "email": email,
            "user_type": UserTypeEnum.user.value,
            "business_id": business_id,
            "name": f"{user_data.first_name} {user_data.last_name}",
            "has_password": True,
            "is_email_verified": True,
            "is_phone_verified": True,
            "phone": phone,
            "password_hash": get_password_hash(user_data.password),
        }

        auth = Auth(**user_data_dict)

        self.session.add(auth)

        await self.session.commit()

        new_user = User(
            uid=auth.uid,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=email,
            business_id=business_id,
            phone=phone,
            permissions=user_data.permissions,
        )

        self.session.add(new_user)

        await self.session.commit()

        return new_user

    async def create_socio_user(self, user_data: SocioUserCreateModel) -> User:
        user_data_dict = user_data.model_dump()

        new_user = User(
            **user_data_dict,
            is_verified=True,
            current_session_id=generate_uuid(),
            password_hash="",
        )

        new_user.role = "user"

        self.session.add(new_user)

        await self.session.commit()

        # user_profile = Profile(uid=new_user.uid, email=new_user.email)

        # self.session.add(user_profile)

        # await self.session.commit()

        return new_user

    async def update_auth(self, auth: Auth, auth_data: dict):

        for k, v in auth_data.items():
            setattr(auth, k, v)

        await self.session.commit()

        return auth

    async def update_user(self, user: User, user_data: dict):

        for k, v in user_data.items():
            setattr(user, k, v)

        await self.session.commit()

        return user

    async def delete_admin(self, user: User):
        await self.session.delete(user)
        await self.session.commit()

    async def upsert_verification_token(self, identifier: str, code: str):
        token = (
            await self.session.exec(select(Token).where(Token.identifier == identifier))
        ).first()

        if token is not None:
            setattr(token, "token", code)
            setattr(token, "is_active", True)
            setattr(token, "expiry", datetime.now() + timedelta(minutes=30))

            await self.session.commit()

            return token
        else:

            new_token = Token(
                identifier=identifier,
                token=code,
                is_active=True,
                expiry=datetime.now() + timedelta(minutes=30),
            )

            self.session.add(new_token)

            await self.session.commit()

            return new_token

    async def is_verification_token_valid(self, identifier: str, code: str):
        token = (
            await self.session.exec(select(Token).where(Token.identifier == identifier))
        ).first()

        if token is not None:
            if (
                token.token == code
                and token.is_active
                and token.expiry >= datetime.now()
            ):

                setattr(token, "is_active", False)

                await self.session.commit()

                return True

        return False

    async def login(self, auth_data: dict):
        email = auth_data.get("email")
        password = auth_data.get("password")
        user_type: List[str] = auth_data.get("user_type")

        result = await self.session.exec(
            select(Auth).where(
                ((Auth.email == email) | (Auth.phone == email)),
                Auth.user_type.in_(user_type),
            )
        )

        auth = result.first()

        if auth is None:
            raise InvalidCredentials()

        if auth.status != "active":
            raise AccountRestricted()

        if not auth.has_password:
            raise InvalidCredentials()

        if not verify_password(password, auth.password_hash):
            raise InvalidCredentials()

        if not auth.is_email_verified:
            raise AccountNotVerified()

        access_token = create_access_token(
            data={
                "uid": str(auth.uid),
                "bid": str(auth.business_id),
            }
        )

        refresh_token = create_access_token(
            data={
                "uid": str(auth.uid),
                "bid": str(auth.business_id),
            },
            refresh=True,
        )

        await self.update_auth(
            auth=auth,
            auth_data={"last_login": datetime.now()},
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "uid": str(auth.uid),
                "email": email,
            },
        }

    async def socio_authentication(self, data: SocioAuthModel):
        email = data.email
        id_token = data.id_token

        socio_user = verify_id_token(id_token=id_token)

        if not socio_user.is_valid:
            return {
                "message": socio_user.error,
                "code": status.HTTP_403_FORBIDDEN,
                "status": False,
            }

        user = await self.get_user_by_email(email)

        if user is None:
            user = await self.create_socio_user(
                user_data=SocioUserCreateModel(email=email, name=socio_user.name)
            )

        access_token = create_access_token(
            data={
                "bid": user.business_id,
                "uid": str(user.uid),
            }
        )

        refresh_token = create_access_token(
            data={
                "bid": user.business_id,
                "uid": str(user.uid),
            },
            refresh=True,
        )

        return {
            "message": "Login successful",
            "data": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "uid": str(user.uid),
                    "email": email,
                },
            },
        }

    async def change_password(self, user_data: dict):
        uid = user_data.get("uid")
        current_password = user_data.get("current_password")
        new_password = user_data.get("new_password")

        user = await self.get_user_by_id(uid=uid)

        if user is None:
            raise UserNotFound()

        if not user.has_password:
            raise InvalidPassword()

        if not verify_password(current_password, user.password_hash):
            raise InvalidPassword()

        await self.update_user(
            user=user,
            user_data={"password_hash": get_password_hash(new_password)},
        )

        return "Password changed successfully"

    async def reset_account_password(
        self, token: str, passwords: PasswordResetConfirmModel
    ):
        token_data = decode_access_token(token)

        new_password = passwords.new_password

        if not token_data:
            raise InvalidToken()

        if not token_data["isTemp"]:
            raise InvalidToken()

        in_blocklist = self.token_in_blocklist(token_data["jti"])

        if in_blocklist:
            return {
                "code": status.HTTP_400_BAD_REQUEST,
                "status": False,
                "message": "Invalid or Expired Link",
            }

        user_email = token_data["user"]["email"]

        if user_email:
            user = await self.get_user_by_email(user_email)

            if not user:
                raise UserNotFound()

            if verify_password(new_password, user.password_hash):
                return {
                    "code": status.HTTP_400_BAD_REQUEST,
                    "status": False,
                    "message": "You cannot use your old password",
                }

            passwd_hash = get_password_hash(new_password)

            await self.update_user(user, {"password_hash": passwd_hash})

            self.add_jti_to_block_list(token_data["jti"])

            return {"message": "Password reset Successfully"}

        return {
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "status": False,
            "message": "Error occured during password reset.",
        }

    async def verify_user_account(self, data: EmailVerificationModel):

        user_email = data.email

        user = await self.get_user_by_email(email=user_email)

        if not user:
            raise UserNotFound()

        if user.is_email_verified:
            raise UserAlreadyVerified()

        if not await self.is_verification_token_valid(
            identifier=user_email, code=data.code
        ):
            raise InvalidToken()

        await self.update_auth(
            auth=user,
            auth_data={"is_email_verified": True},
        )

        access_token = create_access_token(
            data={
                "email": user_email,
                "uid": str(user.uid),
                "bid": str(user.business_id),
            }
        )

        refresh_token = create_access_token(
            data={
                "email": user_email,
                "uid": str(user.uid),
                "bid": str(user.business_id),
            },
            refresh=True,
        )

        return {"access_token": access_token, "refresh_token": refresh_token}

    async def refresh_token(self, token_data: dict):

        if token_data is None:
            raise InvalidToken()

        user = await self.get_user_by_id(token_data["user"]["uid"])

        if user is None:
            raise InvalidToken()

        access_token = create_access_token(data=token_data["user"], refresh=False)

        return {"access_token": access_token}

    async def logout_user(self, user_uid: str) -> User | None:

        user = await self.get_user_by_id(
            uid=user_uid,
        )

        if not user:
            return None

        await self.update_user(
            user=user,
            user_data={"last_login": datetime.now()},
        )

    async def get_device_info(request: Request):
        # 1. Get IP address
        client_host = request.client.host

        # 2. Get User-Agent
        user_agent_str = request.headers.get("user-agent", "")
        user_agent = parse(user_agent_str)

        # 3. Parse device info
        os_name = user_agent.os.family
        browser_name = user_agent.browser.family
        device_name = user_agent.device.family or "Unknown Device"

        # 4. Get timezone (send from client, fallback to "UTC")
        timezone = request.headers.get(
            "x-timezone", "UTC"
        )  # Can be set from frontend using JS

        return {
            "device_ip": client_host,
            "device_name": device_name,
            "device_os": os_name,
            "device_browser": browser_name,
            "timezone": timezone,
        }


def get_auth_service(
    session: AsyncSession = Depends(get_session),
) -> AuthService:
    return AuthService(session)
