from typing import Optional, Literal
import uuid
from pydantic import BaseModel, Field

from src.common.enums import TransactionTypeEnum, TransactionStatusEnum


class TransactionCreate(BaseModel):
    amount: float = Field(
        ..., gt=0, description="Amount must be greater than 0", examples=[5000.00]
    )
    transaction_type: str = Field(
        ...,
        description="Type of transaction",
        examples=[
            TransactionTypeEnum.customer_deposit.value,
            TransactionTypeEnum.payout.value,
            TransactionTypeEnum.expense.value,
            TransactionTypeEnum.loan_out.value,
            TransactionTypeEnum.loan_repayment.value,
            TransactionTypeEnum.income.value,
        ],
    )
    description: Optional[str] = Field(
        default=None, examples=["Initial customer deposit"]
    )
    meta_data: Optional[dict] = Field(
        default=None,
        description="Additional data like customer_id, transaction_type",
        examples=[{"customer_id": "e223f87e-112b-4d0a-9a35-cdbcfae4c4f2"}],
    )


class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(default=None, gt=0, examples=[4500.00])
    description: Optional[str] = Field(
        default=None, examples=["Updated transaction description"]
    )
    # status: Optional[str] = Field(
    #     default=None, examples=[TransactionStatusEnum.completed.value]
    # )
