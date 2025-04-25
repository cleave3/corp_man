from datetime import datetime, timedelta
from src.models import Token, User
from .schemas import SocioUserCreateModel, UserCreateModel
from .utils import generate_uuid

# from .utils import get_password_hash
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


class AuthService:

    async def get_user_by_email(self, email: str, session: AsyncSession) -> User | None:
        user = await session.exec(select(User).where(User.email == email))
        return user.first()
    
    async def get_user_by_phone(self, phone: str, session: AsyncSession) -> User | None:
        user = await session.exec(select(User).where(User.phone == phone))
        return user.first()

    async def get_user_by_id(self, uid: str, session: AsyncSession) -> User | None:
        user = await session.exec(select(User).where(User.uid == uid))
        return user.first()

    async def user_exists(self, email: str, session: AsyncSession) -> bool:
        user = await self.get_user_by_email(email, session)
        return bool(user)

    async def create_user(
        self, user_data: UserCreateModel, session: AsyncSession
    ) -> User:
        user_data_dict = user_data.model_dump()

        new_user = User(**user_data_dict)

        # new_user.password_hash = get_password_hash(user_data_dict["password"])
        new_user.role = "user"

        session.add(new_user)

        await session.commit()

        # user_profile = Profile(uid=new_user.uid, email=new_user.email)

        # session.add(user_profile)

        # await session.commit()

        return new_user

    async def create_socio_user(
        self, user_data: SocioUserCreateModel, session: AsyncSession
    ) -> User:
        user_data_dict = user_data.model_dump()

        new_user = User(
            **user_data_dict,
            is_email_verified=True,
            current_session_id=generate_uuid(),
            password_hash=""
        )

        new_user.role = "user"

        session.add(new_user)

        await session.commit()

        # user_profile = Profile(uid=new_user.uid, email=new_user.email)

        # session.add(user_profile)

        # await session.commit()

        return new_user

    async def update_user(self, user: User, user_data: dict, session: AsyncSession):

        for k, v in user_data.items():
            setattr(user, k, v)

        await session.commit()

        return user

    async def upsert_verification_token(
        self, identifier: str, code: str, session: AsyncSession
    ):
        token = (
            await session.exec(select(Token).where(Token.identifier == identifier))
        ).first()

        if token is not None:
            setattr(token, "token", code)
            setattr(token, "is_active", True)
            setattr(token, "expiry", datetime.now() + timedelta(minutes=30))

            await session.commit()

            return token
        else:

            new_token = Token(
                identifier=identifier,
                token=code,
                is_active=True,
                expiry=datetime.now() + timedelta(minutes=30),
            )

            session.add(new_token)

            await session.commit()

            return new_token

    async def is_verification_token_valid(
        self, identifier: str, code: str, session: AsyncSession
    ):
        token = (
            await session.exec(select(Token).where(Token.identifier == identifier))
        ).first()

        if token is not None:
            if (
                token.token == code
                and token.is_active
                and token.expiry >= datetime.now()
            ):

                setattr(token, "is_active", False)

                await session.commit()

                return True

        return False
