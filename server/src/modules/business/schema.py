from pydantic import BaseModel, EmailStr, HttpUrl, Field, field_validator
from typing import Optional, Annotated


class BusinessCreate(BaseModel):
    business_name: Annotated[str, Field(min_length=2, max_length=100)]
    business_address: Optional[Annotated[str, Field(max_length=255)]] = None
    business_phone: Annotated[str, Field(min_length=7, max_length=20)]

    @field_validator("business_phone")
    @classmethod
    def validate_nigerian_phone(cls, v):
        import re

        pattern = re.compile(r"^(?:\+234|0)[789][01]\d{8}$")
        if not pattern.match(v):
            raise ValueError("Invalid Nigerian phone number")
        return v

    business_email: Optional[EmailStr] = None
    logo_url: Optional[str] = None
    business_type: Optional[Annotated[str, Field(max_length=100)]] = None
    business_nature: Optional[Annotated[str, Field(max_length=255)]] = None
    business_website: Optional[str] = None
    business_reg_no: Optional[Annotated[str, Field(max_length=100)]] = None
    certificate_url: Optional[str] = None
    # modules: Optional[List[str]] = Field(default_factory=list)
    # business_kyc_status: Optional[str] = Field(default="pending")  # Enum is still better for strict control

    class Config:
        json_schema_extra = {
            "example": {
                "business_name": "TechNova Inc.",
                "business_address": "123 Innovation Drive, Silicon Valley, CA",
                "business_phone": "08100000000",
                "business_email": "contact@technova.com",
                "logo_url": "https://example.com/logo.png",
                "business_type": "Technology",
                "business_nature": "Software Development",
                "business_website": "https://technova.com",
                "business_reg_no": "REG-2023-001",
                "certificate_url": "https://example.com/certificate.pdf",
                # "modules": ["invoicing", "payroll", "analytics"],
                # "business_kyc_status": "pending"
            }
        }


class BusinessPreferenceSubmit(BaseModel):
    sms_notification: bool = False
    sms_id: Optional[str] = None
    email_notification: bool = False
    require_two_factor: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "sms_notification": True,
                "sms_id": "NG-SMS-001",
                "email_notification": True,
                "require_two_factor": False
            }
        }