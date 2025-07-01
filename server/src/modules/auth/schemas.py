from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from enum import Enum

from src.common.schema import BaseResponseModel
import re


class UserModel(BaseModel):
    uid: str
    name: str = ""
    email: str
    role: str
    is_verified: bool
    current_session_id: str = Field(exclude=True)
    password_hash: str = Field(exclude=True)
    created_at: datetime
    updated_at: datetime


class UserCreateModel(BaseModel):
    email: str = Field(
        max_length=40,
        examples=["owhiroroeghele@gmail.com"],
        pattern=r"^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b$",
        description="Enter a valid email address",
    )
    first_name: str = Field(examples=["John"], min_length=1, max_length=50)
    last_name: str = Field(examples=["Doe"], min_length=1, max_length=50)
    phone: str = Field(examples=["08100000000"])

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        pattern = r"^0[789][01]\d{8}$"
        if not re.match(pattern, value):
            raise ValueError(
                "Invalid Nigerian phone number. Must be 11 digits and start with 070, 080, 081, 090, or 091."
            )
        return value

    password: str = Field(
        min_length=8,
        description="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        title="Password",
        examples=["Cleave@12345"],
    )
    permissions: List[str] = Field(
        examples=[
            [
                "dashboard.overview",
                "dashboard.revenue",
                "dashboard.target",
                "dashboard.due_payments",
                "dashboard.notifications",
                "dashboard.pending",
                "user.view",
                "user.update",
                "user.create",
                "user.delete",
                "customer.view",
                "customer.update",
                "customer.create",
                "customer.delete",
                "customer.view_balances",
                "business.update",
                "business.view",
                "business.update_preferences",
                "transaction.view",
                "transaction.initiate",
                "transaction.approve",
                "settings.view",
                "settings.modify",
            ]
        ]
    )


class UpdateStatusModel(BaseModel):
    status: Optional[str] = "blocked"


class UpdatePermissionModel(BaseModel):
    permissions: List[str] = Field(
        examples=[
            [
                "dashboard.overview",
                "dashboard.revenue",
                "dashboard.target",
                "dashboard.due_payments",
                "dashboard.notifications",
                "dashboard.pending",
                "user.view",
                "user.update",
                "user.create",
                "user.delete",
                "customer.view",
                "customer.update",
                "customer.create",
                "customer.delete",
                "customer.view_balances",
                "business.update",
                "business.view",
                "business.update_preferences",
                "transaction.view",
                "transaction.initiate",
                "transaction.approve",
                "settings.view",
                "settings.modify",
            ]
        ]
    )


class SocioUserCreateModel(BaseModel):
    name: str = ""
    email: str


class UserLoginModel(BaseModel):
    email: str = Field(max_length=40, examples=["owhiroroeghele@gmail.com"])
    password: str = Field(title="Password", examples=["Cleave@12345"])


class SendPhoneVerificationCodeModel(BaseModel):
    phone: str


class PhoneVerificationModel(BaseModel):
    code: str = Field(
        max_length=6,
        min_length=6,
        title="Verification Code",
        description="Enter the 6-digit code sent to your email",
    )


class ChannelEnum(Enum):
    email = "email"
    phone = "phone"


class ResendVerificationCodeModel(BaseModel):
    email: str
    channel: ChannelEnum = Field(default=ChannelEnum.email)


class PasswordResetRequestModel(BaseModel):
    email: str


class EmailVerificationModel(BaseModel):
    email: str
    code: str = Field(
        max_length=6,
        min_length=6,
        title="Verification Code",
        description="Enter the 6-digit code sent to your email",
    )


class SubmitPersonalInfoModel(BaseModel):
    name: str = Field(
        description="Enter your full name",
        title="Name",
        examples=["John Doe"],
    )
    dob: str = Field(title="Date of Birth", examples=["03-14-1993"])
    telephone: str = Field(
        title="Phone number",
        description="Your current US phone number",
        examples=["+1-555-555-5555"],
    )


class CreatePasswordModel(BaseModel):
    password: str = Field(
        min_length=8,
        description="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        title="Password",
        examples=["123456"],
    )


class ChangePasswordModel(BaseModel):
    current_password: str = Field(
        title="Current Password",
        examples=["123456"],
    )
    new_password: str = Field(
        min_length=8,
        description="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        title="New Password",
        examples=["Newpass@12345"],
    )


class SocioAuthModel(BaseModel):
    id_token: str = Field(
        description="Access token from firebase",
        examples=[
            "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YWNkOTYzZS00NDY5LTRjNTYtOGZiMi02NmRiZDYwY2M0ZmMiLCJyb2xlIjoiSU5ESVZJRFVBTF9QUk9WSURFUiIsImlhdCI6MTczNzEwNzU0MSwiZXhwIjoxNzY4NjY1MTQxfQ.sflEiLrlIT6m__0svAfJSVPRuxruDN9gXHwMibd_bxlRL_ZFy270SOOx0nZlcHZW"
        ],
    )


class AddressCreateModel(BaseModel):
    address_line_1: str = Field(
        title="Address Line 1",
        description="The first line of your address",
        examples=["123 Main St"],
    )
    address_line_2: Optional[str] = Field(
        default=None,
        title="Address Line 2",
        description="The second line of your address (optional)",
        examples=["Apt 4B"],
    )
    city: str = Field(
        title="City", description="The city of your address", examples=["New York"]
    )
    state: str = Field(
        title="State", description="The state of your address", examples=["NY"]
    )
    zip_code: str = Field(
        title="ZIP Code", description="The ZIP code of your address", examples=["10001"]
    )


class PasswordResetConfirmModel(BaseModel):
    new_password: str = Field(min_length=8, max_length=20)


class LoginUser(BaseModel):
    uid: str
    email: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: LoginUser


class LoginResponseModel(BaseResponseModel):
    data: LoginResponse

class IDVerificationResponse(BaseModel):
    is_valid: Optional[bool]
    uid: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    error: Optional[str] = None