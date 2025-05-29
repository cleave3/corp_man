from typing import Optional, Literal
import uuid
from pydantic import BaseModel, Field

from src.common.enums import TransactionTypeEnum, TransactionStatusEnum


class TransactionBase(BaseModel):
    business_id: Optional[uuid.UUID] = Field(
        default=None, example="a1e74521-4c78-4708-805c-9d405c36c1fc"
    )
    amount: float = Field(
        ..., gt=0, description="Amount must be greater than 0", example=5000.00
    )
    transaction_type: Literal[
        TransactionTypeEnum.customer_deposit,
        TransactionTypeEnum.payout,
        TransactionTypeEnum.expense,
        TransactionTypeEnum.loan_out,
        TransactionTypeEnum.loan_repayment,
        TransactionTypeEnum.income,
    ] = Field(
        ...,
        description="Type of transaction",
        example=TransactionTypeEnum.customer_deposit,
    )
    description: Optional[str] = Field(default=None, example="Initial customer deposit")
    meta_data: Optional[dict] = Field(
        default=None,
        description="Additional data like customer_id, transaction_type",
        example={"customer_id": "e223f87e-112b-4d0a-9a35-cdbcfae4c4f2"},
    )


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(default=None, gt=0, example=4500.00)
    description: Optional[str] = Field(
        default=None, example="Updated transaction description"
    )
    status: Optional[TransactionStatusEnum] = Field(
        default=None, example=TransactionStatusEnum.completed
    )
    meta_data: Optional[dict] = Field(
        default=None, example={"customer_id": "e223f87e-112b-4d0a-9a35-cdbcfae4c4f2"}
    )
