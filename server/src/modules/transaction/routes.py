import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.common.utilities import response

from .schema import TransactionCreate, TransactionUpdate
from .service import TransactionService, get_transaction_service

transaction_router = APIRouter()


@transaction_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_transaction(
    data: TransactionCreate,
    service: TransactionService = Depends(get_transaction_service),
):
    return await service.create_transaction(data)


@transaction_router.get(
    "/{transaction_id}",
)
async def get_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    transaction = await service.get_transaction_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@transaction_router.patch(
    "/{transaction_id}",
)
async def update_transaction(
    transaction_id: uuid.UUID,
    data: TransactionUpdate,
    service: TransactionService = Depends(get_transaction_service),
):
    updated = await service.update_transaction(transaction_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated


@transaction_router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    deleted = await service.delete_transaction(transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")


@transaction_router.get("/", response_model=dict)
async def list_transactions(
    business_id: Optional[uuid.UUID] = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, gt=0),
    service: TransactionService = Depends(get_transaction_service),
):
    transactions = await service.paginated_get_transactions(business_id, offset, limit)
    return response(data={**transactions})


@transaction_router.post(
    "/{transaction_id}/approve",
)
async def approve_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    approved = await service.approve_transaction(transaction_id)
    if not approved:
        raise HTTPException(status_code=400, detail="Cannot approve transaction")
    return approved


@transaction_router.get("/wallet/{customer_id}/balance", response_model=dict)
async def get_wallet_balance(
    customer_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    balance = await service.get_wallet_balance(customer_id)
    return {"customer_id": customer_id, "balance": balance}
