from fastapi import (
    APIRouter,
    Depends,
    Request,
    status,
    BackgroundTasks,
    templating,
    HTTPException,
)
from src.common.notification import NotificationService
from src.common.utilities import generate_random_numbers, response
from .schemas import (
    ChangePasswordModel,
    EmailVerificationModel,
    LoginResponseModel,
    PasswordResetConfirmModel,
    PasswordResetRequestModel,
    ResendVerificationCodeModel,
    SocioAuthModel,
    UserCreateModel,
    UserLoginModel,
    ChannelEnum,
    UpdatePermissionModel,
    UpdateStatusModel,
)
from .service import AuthService, get_auth_service
from .utils import (
    create_access_token,
    decode_access_token,
)
from src.middleware.dependencies import (
    RefreshTokenBearer,
    AcessTokenBearer,
    PermissionChecker,
)
from src.common.errors import UserNotFound, ActionNotAllowed
from src.common.permissions import user_permission_actions, user_permission_list
from src.config.settings import Config
from src.common.notification import MailData


auth_router = APIRouter()
templates = templating.Jinja2Templates(directory="view")


@auth_router.post("/register-member", status_code=status.HTTP_201_CREATED)
async def register_team_member(
    user_data: UserCreateModel,
    token_data=Depends(
        PermissionChecker(allowed_permissions=[user_permission_actions["create_user"]])
    ),
    auth_service: AuthService = Depends(get_auth_service),
):

    member = await auth_service.create_user(
        user_data=user_data, business_id=token_data.business_id
    )

    return response(data=member, message="Member add successfully")


@auth_router.get(
    "/user-permissions",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(AcessTokenBearer())],
)
async def get_user_permissions():

    return response(data=user_permission_list)


@auth_router.patch(
    "/update-status/{user_id}",
    status_code=status.HTTP_200_OK,
)
async def update_member_status(
    user_id: str,
    user_data: UpdateStatusModel,
    user=Depends(
        PermissionChecker(allowed_permissions=[user_permission_actions["update_user"]])
    ),
    auth_service: AuthService = Depends(get_auth_service),
):

    if user_id == user.uid:
        raise ActionNotAllowed()

    auth = await auth_service.get_user_by_id(uid=user_id)

    if not auth:
        raise UserNotFound()

    await auth_service.update_auth(auth=auth, auth_data=user_data.model_dump())

    return response(message="status updated successfully")


@auth_router.patch(
    "/update-permissions/{user_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["update_user"]]
            )
        )
    ],
)
async def update_member_permissions(
    user_id: str,
    user_data: UpdatePermissionModel,
    auth_service: AuthService = Depends(get_auth_service),
):

    user = await auth_service.get_profile_by_uid(uid=user_id)

    if not user:
        raise UserNotFound()

    await auth_service.update_user(user=user, user_data=user_data.model_dump())

    return response(message="permissions updated successfully")


@auth_router.get(
    "/users",
    status_code=status.HTTP_200_OK,
)
async def get_users_by_business(
    user=Depends(
        PermissionChecker(allowed_permissions=[user_permission_actions["view_users"]])
    ),
    auth_service: AuthService = Depends(get_auth_service),
):
    users = await auth_service.get_users_by_business_id(business_id=user.business_id)

    return response(data=users)


@auth_router.get(
    "/user/{user_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["view_users"]]
            )
        )
    ],
)
async def get_user_by_id(
    user_id: str,
    auth_service: AuthService = Depends(get_auth_service),
):
    user = await auth_service.get_profile_by_uid(uid=user_id)

    auth = await auth_service.get_user_by_id(uid=user_id)

    return response(data={"user": user, "auth": auth})


@auth_router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_user_account(
    data: EmailVerificationModel,
    auth_service: AuthService = Depends(get_auth_service),
):

    result = await auth_service.verify_user_account(data=data)

    return response(
        status=True,
        code=status.HTTP_200_OK,
        message="Email verified successfully",
        data=result,
    )


@auth_router.post(
    "/resend-verification-code",
    status_code=status.HTTP_201_CREATED,
)
async def resend_verification_code(
    data: ResendVerificationCodeModel,
    bg_task: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service),
):
    email = data.email

    user_exists = await auth_service.user_exists(email)

    if not user_exists:
        raise UserNotFound()

    code = generate_random_numbers(6)
    telephone = user_exists.phone

    identifier = email if data.channel is ChannelEnum.email else telephone

    if not identifier:
        raise HTTPException(
            detail={
                "status": False,
                "code": status.HTTP_204_NO_CONTENT,
                "message": f"{ChannelEnum.email} is not available",
                "data": None,
            }
        )

    await auth_service.upsert_verification_token(identifier=identifier, code=code)

    if data.channel == ChannelEnum.email:
        html = f"""
            <h1>Verify your Email</h1>
            <p>Please use the token below to verify your email</p>
            <p style="text-align: center; font-weight: bold;">{code}</p>
        """

        bg_task.add_task(
            NotificationService.send_email,
            recipients=email,
            subject="Verification",
            message=html,
        )
    else:
        """send sms"""
        bg_task.add_task(
            NotificationService.send_sms,
            recipient=telephone,
            message=f"Your verification code is {code}",
        )

    return response(
        code=status.HTTP_200_OK,
        status=True,
        message=f"Please check your {data.channel.value} for your verification code",
    )


@auth_router.post("/login-user", status_code=status.HTTP_200_OK)
async def login_user(
    auth_data: UserLoginModel,
    auth_service: AuthService = Depends(get_auth_service),
):
    email = auth_data.email
    password = auth_data.password

    result = await auth_service.login(
        auth_data={
            "email": email,
            "password": password,
            "user_type": ["user", "root", "staff"],
        },
    )

    return response(message="Login successful", data=result)


@auth_router.post("/login-admin", status_code=status.HTTP_200_OK)
async def login_admin(
    user_data: UserLoginModel,
    auth_service: AuthService = Depends(get_auth_service),
):
    email = user_data.email
    password = user_data.password

    result = await auth_service.login(
        user_data={
            "email": email,
            "password": password,
            "user_type": ["admin"],
        },
    )

    return response(message="Login successful", data=result)


@auth_router.post("/socio-auth", status_code=status.HTTP_200_OK)
async def socio_authentication(
    data: SocioAuthModel,
    auth_service: AuthService = Depends(get_auth_service),
):
    result = await auth_service.socio_authentication(data=data)

    return response(**result)


@auth_router.get("/refresh-token", status_code=status.HTTP_200_OK)
async def refresh_token(
    token_data: dict = Depends(RefreshTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
):
    result = await auth_service.refresh_token(token_data=token_data)

    return response(data=result)


@auth_router.get("/me", status_code=status.HTTP_200_OK)
async def get_current_user(
    token_data: dict = Depends(AcessTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
):
    print(token_data)
    user = await auth_service.get_profile_by_uid(uid=token_data["user"]["uid"])

    auth = await auth_service.get_user_by_id(uid=token_data["user"]["uid"])

    return response(
        data={**user.model_dump(), **auth.model_dump(exclude="password_hash")}
    )


@auth_router.patch("/change-password")
async def change_password(
    data: ChangePasswordModel,
    token_data: dict = Depends(AcessTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
):
    result = await auth_service.change_password(
        user_data={
            "uid": token_data["user"]["uid"],
            "current_password": data.current_password,
            "new_password": data.new_password,
        }
    )

    return response(message=result)


@auth_router.post("/forgot-password")
async def forgot_password(
    email_data: PasswordResetRequestModel,
    bg_task: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service),
):
    email = email_data.email

    user = await auth_service.get_user_by_email(email=email)

    if user is None:
        raise UserNotFound()

    temp_token = create_access_token(data={"email": email}, isTemp=True)

    link = f"{Config.BASE_URL}/api/v1/auth/password-reset-confirm/{temp_token}"

    html = f"""
    <h1>Reset Your Password</h1>
    <p>Please click this <a href="{link}">link</a> to Reset Your Password</p>
    <p>Link will expire in 10 minutes</>
    """

    bg_task.add_task(
        NotificationService.send_email,
        MailData(recipients=[email], subject="Reset Your Password", message=html),
    )

    return response(
        message="Please check your email for instructions to reset your password"
    )


@auth_router.get("/password-reset-confirm/{token}", include_in_schema=False)
async def reset_password_form(
    request: Request,
    token: str,
    auth_service: AuthService = Depends(get_auth_service),
):
    token_data = decode_access_token(token)

    if not token_data:
        return templates.TemplateResponse(
            "error.html", {"request": request, "message": "Invalid or Expired Link"}
        )

    in_blocklist = auth_service.token_in_blocklist(token_data["jti"])

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


@auth_router.post("/password-reset-confirm/{token}", include_in_schema=False)
async def reset_account_password(
    token: str,
    passwords: PasswordResetConfirmModel,
    auth_service: AuthService = Depends(get_auth_service),
):

    result = await auth_service.reset_account_password(token=token, passwords=passwords)

    return response(**result)


@auth_router.get("/reset-success", include_in_schema=False)
async def reset_password_result(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})


@auth_router.get("/logout", status_code=status.HTTP_200_OK)
async def logout(
    token_data: dict = Depends(AcessTokenBearer()),
    auth_service: AuthService = Depends(get_auth_service),
):
    auth_service.add_jti_to_block_list(token_data["jti"])

    await auth_service.logout_user(user_uid=token_data["user"]["uid"])

    return response(message="Logout successful")
