from typing import List
from pydantic import Field, BaseModel


class AdminCreateModel(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=40,
        examples=["John"],
        description="Enter admin name",
    )
    email: str = Field(
        max_length=40,
        examples=["johndoe@mail.com"],
        pattern=r"^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b$",
        description="Enter a valid email address",
    )
    permissions: List[str] = Field(
        examples=[
            [
                "admin.view_users",
                "admin.update_users",
                "admin.create_admin",
                "admin.view_admin",
                "admin.delete_admin",
                # "subscription.create_plan",
                # "subscription.update_plan",
                "subscription.view_plan",
                "subscription.view_transactions",
            ]
        ]
    )


class UpdateUserStatusModel(BaseModel):
    status: str = Field(
        examples=["active", "blocked"],
        pattern=r"^(active|blocked)",
        description="user status",
    )


class SubscriptionSettings(BaseModel):
    mode: str = Field(examples=["YES", "NO"])


class SubmitConfig(BaseModel):
    subscription_settings: SubscriptionSettings = Field(
        examples=[
            {"mode": "YES"},
            {"mode": "NO"},
        ]
    )
    support_email: str = Field(examples=["support@mycreditaction.com"])
    support_phone: str = Field(examples=["+12345678"], max_length=11)
