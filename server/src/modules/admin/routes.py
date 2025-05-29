from fastapi import APIRouter, BackgroundTasks, Depends, status, Query
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.common.errors import ActionNotAllowed, UserAlreadyExists, UserNotFound
from src.common.notification import MailData, NotificationService
from src.common.utilities import generate_random_numbers, response
from src.config.db import get_session
from src.middleware.dependencies import get_current_admin, PermissionChecker
from src.modules.admin.schema import (
    AdminCreateModel,
    SubmitConfig,
    UpdateUserStatusModel,
)
from src.modules.auth.service import AuthService
from src.modules.auth.utils import get_password_hash
from .service import AdminService
from src.common.permissions import admin_permission_actions
from typing import Annotated


admin_router = APIRouter()
admin_service = AdminService()
# user_service = AuthService()


# @admin_router.post("/create", status_code=status.HTTP_200_OK)
# async def create_admin(
#     user_data: AdminCreateModel,
#     bg_task: BackgroundTasks,
#     user=Depends(PermissionChecker([admin_permission_actions["create_admin"]])),
#     session: AsyncSession = Depends(get_session),
# ):
#     email = user_data.email
#     user_uid = user.uid

#     user_exists = await user_service.user_exists(email, session)

#     if user_exists:
#         raise UserAlreadyExists()

#     password = generate_random_numbers(8)

#     new_user = await admin_service.create_user(
#         user_uid=user_uid,
#         user_data={
#             **user_data.model_dump(),
#             "password_hash": get_password_hash(password),
#             "invitedby_id": user_uid,
#         },
#         session=session,
#     )

#     html = f"""
#         <p>You have been invited to join your team on CreditApp</p>
#         <p>Please use the credentials below to login</p>
#         <p>Email: {email}</p>
#         <p>Password: {password}</p>
#     """

#     bg_task.add_task(
#         NotificationService.send_email,
#         MailData(
#             recipients=[email],
#             subject="CreditApp Invitation - Welcome to the Team",
#             message=html,
#         ),
#     )

#     return response(
#         code=status.HTTP_201_CREATED,
#         status=True,
#         message=f"Invitation has been sent to {email}",
#         data=new_user,
#     )


# @admin_router.get(
#     "",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["view_admin"]]))],
# )
# async def get_admins(session: AsyncSession = Depends(get_session)):
#     admins = await admin_service.get_all_admins(session=session)

#     return response(data=admins)


# @admin_router.get(
#     "/users",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["view_users"]]))],
# )
# async def get_users(
#     session: AsyncSession = Depends(get_session),
#     status: Annotated[
#         str | None, Query(description="Filter by status (e.g., active, blocked)")
#     ] = None,
#     page: Annotated[
#         int, Query(ge=1, description="Page number, must be 1 or greater")
#     ] = 1,
#     limit: Annotated[
#         int,
#         Query(ge=1, le=100, description="Number of items per page, between 1 and 100"),
#     ] = 10,
#     name: Annotated[str | None, Query(description="Filter by user name")] = None,
#     email: Annotated[str | None, Query(description="Filter by user email")] = None,
# ):
#     users = await admin_service.get_all_users(
#         session=session,
#         status=status,
#         page=page,
#         limit=limit,
#         name=name,
#         email=email,
#     )

#     return response(data=users)


# @admin_router.get(
#     "/user-transactions",
#     status_code=status.HTTP_200_OK,
#     dependencies=[
#         Depends(PermissionChecker([admin_permission_actions["view_transactions"]]))
#     ],
# )
# async def get_users(
#     session: AsyncSession = Depends(get_session),
#     status: Annotated[
#         str | None, Query(description="Filter by status (e.g., completed, failed)")
#     ] = None,
#     page: Annotated[
#         int, Query(ge=1, description="Page number, must be 1 or greater")
#     ] = 1,
#     limit: Annotated[
#         int,
#         Query(ge=1, le=100, description="Number of items per page, between 1 and 100"),
#     ] = 10,
# ):
#     users = await admin_service.get_transactions(
#         session=session,
#         status=status,
#         page=page,
#         limit=limit,
#     )

#     return response(data=users)


# @admin_router.get(
#     "/permissions",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["create_admin"]]))],
# )
# async def get_permissions():
#     permissions = await admin_service.get_permissions()

#     return response(data=permissions)


# @admin_router.get(
#     "/stats", status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin)]
# )
# async def get_stats(session: AsyncSession = Depends(get_session)):
#     permissions = await admin_service.analytics(session=session)

#     return response(data=permissions)


# @admin_router.patch(
#     "/update-status/{user_uid}",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["update_users"]]))],
# )
# async def update_user_and_admin_status(
#     user_uid: str,
#     data: UpdateUserStatusModel,
#     session: AsyncSession = Depends(get_session),
# ):

#     user = await user_service.get_user_by_id(uid=user_uid, session=session)

#     if not user:
#         raise UserNotFound()

#     user = await user_service.update_user(
#         user, {"status": data.status}, session=session
#     )

#     return response(
#         status=True, code=status.HTTP_200_OK, message="status updated Successfully"
#     )


# @admin_router.delete(
#     "/delete/{user_uid}",
#     status_code=status.HTTP_200_OK,
# )
# async def delete_admin(
#     user_uid: str,
#     user=Depends(PermissionChecker([admin_permission_actions["delete_admin"]])),
#     session: AsyncSession = Depends(get_session),
# ):

#     if user.uid == user_uid:
#         raise ActionNotAllowed()

#     user = await user_service.get_user_by_id(uid=user_uid, session=session)

#     if not user:
#         raise UserNotFound()

#     if user.role != "admin":
#         raise UserNotFound()

#     await user_service.delete_admin(user=user, session=session)

#     return response(
#         status=True,
#         code=status.HTTP_200_OK,
#         message="Admin deleted successfully Successfully",
#     )


# @admin_router.post(
#     "/set-configuration",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["modify_settings"]]))],
# )
# async def set_configurations(
#     data: SubmitConfig,
#     session: AsyncSession = Depends(get_session),
# ):

#     config = await admin_service.submit_config(
#         config_data=data.model_dump(), session=session
#     )

#     return response(data=config)


# @admin_router.get(
#     "/configuration",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(PermissionChecker([admin_permission_actions["modify_settings"]]))],
# )
# async def get_configurations(session: AsyncSession = Depends(get_session)):

#     config = await admin_service.get_config(session=session)

#     return response(data=config)
