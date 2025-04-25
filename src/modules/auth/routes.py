from fastapi import (
    APIRouter,
    Depends,
    Request,
    status,
    BackgroundTasks,
    templating,
)
from fastapi.responses import JSONResponse

from src.common.utilities import generate_random_numbers, response
from src.config import RedisService
from src.firebase import verify_id_token
from .schemas import (
    CreatePasswordModel,
    EmailVerificationModel,
    LoginResponseModel,
    PasswordResetConfirmModel,
    PasswordResetRequestModel,
    PhoneVerificationModel,
    ResendVerificationCodeModel,
    SendPhoneVerificationCodeModel,
    SocioAuthModel,
    SocioUserCreateModel,
    UserCreateModel,
    UserLoginModel,
)
from .service import AuthService
from src.config import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import (
    create_access_token,
    decode_access_token,
    generate_uuid,
    verify_password,
    get_password_hash,
)
from .dependencies import RefreshTokenBearer, AcessTokenBearer, get_current_user
from src.common.errors import (
    InvalidCredentials,
    PasswordAlreadySet,
    UserAlreadyExists,
    InvalidToken,
    UserAlreadyVerified,
    UserNotFound,
)
from src.config.settings import Config
from src.common.mail import sendMail, MailData


auth_router = APIRouter()
user_service = AuthService()
redis_service = RedisService()
templates = templating.Jinja2Templates(directory="view")


@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user_account(
    user_data: UserCreateModel,
    bg_task: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    email = user_data.email

    user_exists = await user_service.user_exists(email, session)

    if user_exists:
        raise UserAlreadyExists()

    new_user = await user_service.create_user(user_data, session)

    code = generate_random_numbers(6)

    await user_service.upsert_verification_token(
        identifier=email, code=code, session=session
    )

    html = f"""
        <h1>Verify your Email</h1>
        <p>Please use the token below to verify your email</p>
        <p style="text-align: center; font-weight: bold;">{code}</p>
    """

    bg_task.add_task(
        sendMail, MailData(recipients=[email], subject="Welcome", message=html)
    )
    # sendMail(MailData(recipients=[email], subject="Welcome", message=html))

    return response(
        code=status.HTTP_201_CREATED,
        status=True,
        message="Signup successful, Please check your email to verify your account",
        data=new_user,
    )


@auth_router.post(
    "/resend-verification",
    status_code=status.HTTP_201_CREATED,
)
async def resend_email_verification_code(
    data: ResendVerificationCodeModel,
    bg_task: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    email = data.email
    user_exists = await user_service.user_exists(email, session)

    if not user_exists:
        raise UserNotFound()

    code = generate_random_numbers(6)

    await user_service.upsert_verification_token(
        identifier=email, code=code, session=session
    )

    html = f"""
        <h1>Verify your Email</h1>
        <p>Please use the token below to verify your email</p>
        <p style="text-align: center; font-weight: bold;">{code}</p>
    """

    bg_task.add_task(
        sendMail, MailData(recipients=[email], subject="Verification", message=html)
    )
    # sendMail(MailData(recipients=[email], subject="Welcome", message=html))

    return response(
        code=status.HTTP_200_OK,
        status=True,
        message="Please check your email to verify your account",
    )


@auth_router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_user_account(
    data: EmailVerificationModel, session: AsyncSession = Depends(get_session)
):

    user_email = data.email

    user = await user_service.get_user_by_email(email=user_email, session=session)

    if not user:
        raise UserNotFound()

    if user.is_email_verified:
        raise UserAlreadyVerified()

    if not await user_service.is_verification_token_valid(
        identifier=user_email, code=data.code, session=session
    ):
        raise InvalidToken()

    await user_service.update_user(
        user=user, user_data={"is_email_verified": True}, session=session
    )

    access_token = create_access_token(
        data={"email": user_email, "uid": str(user.uid), "role": user.role}
    )

    refresh_token = create_access_token(
        data={"email": user_email, "uid": str(user.uid), "role": user.role},
        refresh=True,
    )

    return response(
        status=True,
        code=status.HTTP_200_OK,
        message="Email verified successfully",
        data={"access_token": access_token, "refresh_token": refresh_token},
    )


@auth_router.post(
    "/send-phone-verification-code",
    status_code=status.HTTP_201_CREATED,
)
async def send_phone_verification_code(
    data: SendPhoneVerificationCodeModel,
    bg_task: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    phone = data.phone
    user_exists = await user_service.get_user_by_phone(phone, session)

    if not user_exists:
        raise UserNotFound()

    code = generate_random_numbers(6)

    await user_service.upsert_verification_token(
        identifier=phone, code=code, session=session
    )

    # send sms code here

    return response(
        code=status.HTTP_200_OK,
        status=True,
        message="Please check your sms for verification code",
    )


@auth_router.post("/verify-phone", status_code=status.HTTP_200_OK)
async def verify_user_account(
    data: PhoneVerificationModel, session: AsyncSession = Depends(get_session)
):

    user_phone = data.phone

    user = await user_service.get_user_by_phone(phone=user_phone, session=session)

    if not user:
        raise UserNotFound()

    if user.is_phone_verified:
        raise UserAlreadyVerified()

    if not await user_service.is_verification_token_valid(
        identifier=user_phone, code=data.code, session=session
    ):
        raise InvalidToken()

    await user_service.update_user(
        user=user, user_data={"is_phone_verified": True}, session=session
    )

    access_token = create_access_token(
        data={"email": user.email, "uid": str(user.uid), "role": user.role}
    )

    refresh_token = create_access_token(
        data={"email": user.email, "uid": str(user.uid), "role": user.role},
        refresh=True,
    )

    return response(
        status=True,
        code=status.HTTP_200_OK,
        message="Phone number verified successfully",
        data={"access_token": access_token, "refresh_token": refresh_token},
    )


@auth_router.post("/set-password", status_code=status.HTTP_200_OK)
async def set_user_password(
    data: CreatePasswordModel,
    token_data: dict = Depends(AcessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    new_password = data.password

    user_email = token_data["user"]["email"]

    user = await user_service.get_user_by_email(user_email, session=session)

    if not user:
        raise UserNotFound()

    if user.has_password:
        raise PasswordAlreadySet()

    passwd_hash = get_password_hash(new_password)

    await user_service.update_user(
        user, {"password_hash": passwd_hash, "has_password": True}, session=session
    )

    return response(
        status=True, code=status.HTTP_200_OK, message="Password set Successfully"
    )


@auth_router.post(
    "/login", status_code=status.HTTP_200_OK, response_model=LoginResponseModel
)
async def login(
    user_data: UserLoginModel, session: AsyncSession = Depends(get_session)
):
    email = user_data.email
    password = user_data.password

    user = await user_service.get_user_by_email(email, session)

    if user is None:
        raise InvalidCredentials()

    if not user.has_password:
        raise InvalidCredentials()

    if not verify_password(password, user.password_hash):
        raise InvalidCredentials()

    updated_user = await user_service.update_user(
        user=user, user_data={"current_session_id": generate_uuid()}, session=session
    )

    access_token = create_access_token(
        data={
            "email": email,
            "uid": str(user.uid),
            "role": user.role,
            "session_id": str(updated_user.current_session_id),
        }
    )

    refresh_token = create_access_token(
        data={"email": email, "uid": str(user.uid), "role": user.role}, refresh=True
    )

    return response(
        message="Login successful",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "uid": str(user.uid),
                "email": email,
            },
        },
    )


@auth_router.post("/socio-auth", status_code=status.HTTP_200_OK)
async def socio_authentication(
    data: SocioAuthModel, session: AsyncSession = Depends(get_session)
):
    email = data.email
    id_token = data.id_token

    user = await user_service.get_user_by_email(email, session)

    if user is not None:
        socio_user = verify_id_token(id_token=id_token)

        if socio_user.is_valid:

            access_token = create_access_token(
                data={
                    "email": email,
                    "uid": str(user.uid),
                    "role": user.role,
                    "session_id": str(user.current_session_id),
                }
            )

            refresh_token = create_access_token(
                data={"email": email, "uid": str(user.uid), "role": user.role},
                refresh=True,
            )

            return response(
                message="Login successful",
                data={
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "uid": str(user.uid),
                        "email": email,
                    },
                },
            )
        else:
            return response(message=socio_user.error, code=status.HTTP_403_FORBIDDEN)

    else:
        socio_user = verify_id_token(id_token=id_token, return_detail=True)

        if socio_user.is_valid:

            new_user = await user_service.create_socio_user(
                user_data=SocioUserCreateModel(email=email, name=socio_user.name),
                session=session,
            )

            access_token = create_access_token(
                data={
                    "email": email,
                    "uid": str(new_user.uid),
                    "role": new_user.role,
                    "session_id": str(new_user.current_session_id),
                }
            )

            refresh_token = create_access_token(
                data={"email": email, "uid": str(new_user.uid), "role": new_user.role},
                refresh=True,
            )

            return response(
                message="Login successful",
                data={
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "uid": str(new_user.uid),
                        "email": email,
                    },
                },
            )
        else:
            return response(message=socio_user.error, code=status.HTTP_403_FORBIDDEN)


@auth_router.get("/refresh-token", status_code=status.HTTP_200_OK)
async def refresh_token(
    token_data: dict = Depends(RefreshTokenBearer()),
    session: AsyncSession = Depends(get_session),
):

    if token_data is None:
        raise InvalidToken()

    user = await user_service.get_user_by_email(token_data["user"]["email"], session)

    if user is None:
        raise InvalidToken()

    access_token = create_access_token(data=token_data["user"], refresh=False)

    return JSONResponse(
        content={"access_token": access_token},
        status_code=status.HTTP_200_OK,
    )


@auth_router.get("/me", status_code=status.HTTP_200_OK)
async def get_current_user(user: dict = Depends(get_current_user)):

    return response(data=user)


@auth_router.post("/forgot-password")
async def forgot_password(
    email_data: PasswordResetRequestModel, bg_task: BackgroundTasks
):
    email = email_data.email

    temp_token = create_access_token(data={"email": email}, isTemp=True)

    link = f"{Config.BASE_URL}/api/v1/auth/password-reset-confirm/{temp_token}"

    html = f"""
    <h1>Reset Your Password</h1>
    <p>Please click this <a href="{link}">link</a> to Reset Your Password</p>
    <p>Link will expire in 10 minutes</>
    """

    bg_task.add_task(
        sendMail,
        MailData(recipients=[email], subject="Reset Your Password", message=html),
    )

    return response(
        message="Please check your email for instructions to reset your password"
    )


@auth_router.get("/password-reset-confirm/{token}")
async def reset_password_form(request: Request, token: str):
    token_data = decode_access_token(token)

    if not token_data:
        return templates.TemplateResponse(
            "error.html", {"request": request, "message": "Invalid or Expired Link"}
        )

    in_blocklist = redis_service.token_in_blocklist(token_data["jti"])

    if in_blocklist:
        return templates.TemplateResponse(
            "error.html", {"request": request, "message": "Invalid or Expired Link"}
        )

    user_email = token_data["user"]["email"]

    if not user_email:
        return templates.TemplateResponse(
            "error.html", {"request": request, "message": "Invalid or Expired Link"}
        )

    return templates.TemplateResponse(
        "reset_password.html", {"request": request, "token": token}
    )


@auth_router.get("/reset-success")
async def reset_password_result(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})


@auth_router.post("/password-reset-confirm/{token}")
async def reset_account_password(
    token: str,
    passwords: PasswordResetConfirmModel,
    session: AsyncSession = Depends(get_session),
):
    token_data = decode_access_token(token)

    new_password = passwords.new_password

    if not token_data:
        raise InvalidToken()

    if not token_data["isTemp"]:
        raise InvalidToken()

    in_blocklist = redis_service.token_in_blocklist(token_data["jti"])

    if in_blocklist:
        return response(
            code=status.HTTP_400_BAD_REQUEST,
            status=False,
            message="Invalid or Expired Link",
        )

    user_email = token_data["user"]["email"]

    if user_email:
        user = await user_service.get_user_by_email(user_email, session)

        if not user:
            raise UserNotFound()

        if verify_password(new_password, user.password_hash):
            return response(
                code=status.HTTP_400_BAD_REQUEST,
                status=False,
                message="You cannot use your old password",
            )

        passwd_hash = get_password_hash(new_password)

        await user_service.update_user(user, {"password_hash": passwd_hash}, session)

        redis_service.add_jti_to_block_list(token_data["jti"])

        return response(message="Password reset Successfully")

    return response(
        code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        status=False,
        message="Error occured during password reset.",
    )


@auth_router.get("/logout", status_code=status.HTTP_200_OK)
async def logout(token_data: dict = Depends(AcessTokenBearer())):
    redis_service.add_jti_to_block_list(token_data["jti"])
    redis_service.remove_store_value_if_exist(token_data["session_id"])

    return response(message="Logout successful")
