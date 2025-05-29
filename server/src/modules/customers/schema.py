from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from src.common.enums import PaymentFrequencyEnum


class CustomerCreate(BaseModel):
    first_name: str = Field(..., max_length=100, examples=["Jane"])
    last_name: Optional[str] = Field(default=None, max_length=100, examples=["Doe"])
    email: Optional[str] = Field(default=None, examples=["jane.doe@examples.com"])
    phone: Optional[str] = Field(
        default=None, max_length=15, examples=["+2348012345678"]
    )
    image_url: Optional[str] = Field(
        default=None, examples=["https://examples.com/images/jane.jpg"]
    )
    address: Optional[str] = Field(
        default=None, examples=["23 Freedom Street, Lagos, Nigeria"]
    )
    payment_frequency: str = Field(
        default=PaymentFrequencyEnum.monthly.value,
        examples=[PaymentFrequencyEnum.monthly.value],
    )
    next_payment_date: Optional[datetime] = Field(
        default=None, examples=["2025-07-01T00:00:00"]
    )
    opening_balance: Optional[float] = Field(default=0.0, examples=[100.0])


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100, examples=["Jane"])
    last_name: Optional[str] = Field(default=None, max_length=100, examples=["Smith"])
    email: Optional[str] = Field(default=None, examples=["jane.smith@examples.com"])
    phone: Optional[str] = Field(
        default=None, max_length=15, examples=["+2348012345678"]
    )
    image_url: Optional[str] = Field(
        default=None, examples=["https://examples.com/images/jane_updated.jpg"]
    )
    address: Optional[str] = Field(default=None, examples=["42 Update Avenue, Abuja"])
    payment_frequency: Optional[str] = Field(
        default=None,
        examples=[
            PaymentFrequencyEnum.weekly.value,
            PaymentFrequencyEnum.monthly.value,
        ],
    )
    next_payment_date: Optional[datetime] = Field(
        default=None, examples=["2025-07-15T00:00:00"]
    )
