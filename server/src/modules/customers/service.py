import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.config.db import get_session
from src.models import Customer
from .schema import CustomerCreate, CustomerUpdate


class CustomerService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_customer(self, data: CustomerCreate) -> Customer:
        customer = Customer(**data.model_dump())
        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def get_customer_by_id(self, customer_id: uuid.UUID) -> Optional[Customer]:
        result = await self.session.exec(
            select(Customer).where(Customer.id == customer_id)
        )
        return result.first()

    async def update_customer(
        self, customer_id: uuid.UUID, data: CustomerUpdate
    ) -> Optional[Customer]:
        customer = await self.get_customer_by_id(customer_id)
        if not customer:
            return None

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(customer, key, value)

        customer.updated_at = datetime.now()
        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def delete_customer(self, customer_id: uuid.UUID) -> bool:
        customer = await self.get_customer_by_id(customer_id)
        if not customer:
            return False

        await self.session.delete(customer)
        await self.session.commit()
        return True

    async def paginated_get_customers(
        self, business_id: Optional[uuid.UUID] = None, offset: int = 0, limit: int = 10
    ) -> dict:
        stmt = select(Customer)
        if business_id:
            stmt = stmt.where(Customer.business_id == business_id)
        total = await self.session.exec(
            select([Customer.id]).where(Customer.business_id == business_id)
        )
        total_count = len(total.fetchall())
        stmt = stmt.offset(offset).limit(limit)
        result = await self.session.exec(stmt)
        customers = result.fetchall()
        return {
            "total": total_count,
            "offset": offset,
            "limit": limit,
            "items": customers,
        }


def get_customer_service(
    session: AsyncSession = Depends(get_session),
) -> CustomerService:
    return CustomerService(session)
