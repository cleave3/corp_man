from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field
from src.common.enums import PaymentFrequencyEnum  # Adjust import as needed


import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from src.common.enums import PaymentFrequencyEnum


class CustomerBase(BaseModel):
    business_id: Optional[uuid.UUID] = Field(
        default=None, example="f37a4f0c-719b-4b6b-a16f-6dd5fc495b91"
    )
    first_name: str = Field(..., max_length=100, example="Jane")
    last_name: Optional[str] = Field(default=None, max_length=100, example="Doe")
    email: Optional[str] = Field(default=None, example="jane.doe@example.com")
    phone: Optional[str] = Field(default=None, max_length=15, example="+2348012345678")
    image_url: Optional[str] = Field(
        default=None, example="https://example.com/images/jane.jpg"
    )
    address: Optional[str] = Field(
        default=None, example="23 Freedom Street, Lagos, Nigeria"
    )
    payment_frequency: PaymentFrequencyEnum = Field(
        default=PaymentFrequencyEnum.monthly, example=PaymentFrequencyEnum.monthly
    )
    next_payment_date: Optional[datetime] = Field(
        default=None, example="2025-07-01T00:00:00"
    )


class CustomerCreate(CustomerBase):
    first_name: str = Field(..., min_length=1, example="Jane")


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100, example="Jane")
    last_name: Optional[str] = Field(default=None, max_length=100, example="Smith")
    email: Optional[str] = Field(default=None, example="jane.smith@example.com")
    phone: Optional[str] = Field(default=None, max_length=15, example="+2348012345678")
    image_url: Optional[str] = Field(
        default=None, example="https://example.com/images/jane_updated.jpg"
    )
    address: Optional[str] = Field(default=None, example="42 Update Avenue, Abuja")
    payment_frequency: Optional[PaymentFrequencyEnum] = Field(
        default=None, example=PaymentFrequencyEnum.weekly
    )
    next_payment_date: Optional[datetime] = Field(
        default=None, example="2025-07-15T00:00:00"
    )


class CustomerRead(CustomerBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
