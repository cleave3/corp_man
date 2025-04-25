from pydantic import BaseModel, Field
from datetime import datetime

from src.common.schema import BaseResponseModel


class UserModel(BaseModel):
    uid: str
    name: str = ""
    email: str
    role: str
    is_email_verified: bool = False
    is_phone_verified: bool = False
    current_session_id: str = Field(exclude=True)
    password_hash: str = Field(exclude=True)
    created_at: datetime
    updated_at: datetime


class UserCreateModel(BaseModel):
    email: str = Field(
        max_length=40,
        examples=["johndoe@mail.com"],
        pattern=r"^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b$",
        description="Enter a valid email address"
    )


class SocioUserCreateModel(BaseModel):
    name: str = ""
    email: str


class UserLoginModel(BaseModel):
    email: str = Field(max_length=40, examples=["owhiroroeghele@gmail.com"])
    password: str = Field(
        min_length=8,
        description="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        title="Password",
        examples=["Cleave@12345"]
    )


class SendPhoneVerificationCodeModel(BaseModel):
    phone: str

class PhoneVerificationModel(BaseModel):
    phone: str
    code: str = Field(
        max_length=6,
        min_length=6,
        title="Verification Code",
        description="Enter the 6-digit code sent to your email",
    )

class ResendVerificationCodeModel(BaseModel):
    email: str


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


class CreatePasswordModel(BaseModel):
    password: str = Field(
        min_length=8,
        description="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        title="Password",
        examples=["123456"],
    )


class SocioAuthModel(BaseModel):
    email: str = Field(max_length=40, examples=["owhiroroeghele@gmail.com"])
    id_token: str = Field(
        description="Access token from firebase",
        examples=[
            "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YWNkOTYzZS00NDY5LTRjNTYtOGZiMi02NmRiZDYwY2M0ZmMiLCJyb2xlIjoiSU5ESVZJRFVBTF9QUk9WSURFUiIsImlhdCI6MTczNzEwNzU0MSwiZXhwIjoxNzY4NjY1MTQxfQ.sflEiLrlIT6m__0svAfJSVPRuxruDN9gXHwMibd_bxlRL_ZFy270SOOx0nZlcHZW"
        ],
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
