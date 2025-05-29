import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from .schema import CustomerCreate, CustomerRead, CustomerUpdate
from .service import CustomerService, get_customer_service

customer_router = APIRouter()


@customer_router.post(
    "/", response_model=CustomerRead, status_code=status.HTTP_201_CREATED
)
async def create_customer(
    data: CustomerCreate,
    service: CustomerService = Depends(get_customer_service),
):
    return await service.create_customer(data)


@customer_router.get("/{customer_id}", response_model=CustomerRead)
async def get_customer_by_id(
    customer_id: uuid.UUID,
    service: CustomerService = Depends(get_customer_service),
):
    customer = await service.get_customer_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@customer_router.patch("/{customer_id}", response_model=CustomerRead)
async def update_customer(
    customer_id: uuid.UUID,
    data: CustomerUpdate,
    service: CustomerService = Depends(get_customer_service),
):
    updated = await service.update_customer(customer_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Customer not found")
    return updated


@customer_router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: uuid.UUID,
    service: CustomerService = Depends(get_customer_service),
):
    deleted = await service.delete_customer(customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")


@customer_router.get("/", response_model=dict)
async def list_customers(
    business_id: Optional[uuid.UUID] = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, gt=0),
    service: CustomerService = Depends(get_customer_service),
):
    result = await service.paginated_get_customers(business_id, offset, limit)
    return result
