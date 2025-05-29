import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.errors import CustomerNotFound
from src.modules.transaction.schema import TransactionCreate
from src.modules.transaction.service import get_transaction_service
from src.config.db import get_session
from src.models import Customer
from .schema import CustomerCreate, CustomerUpdate


class CustomerService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_customer(self, business_id: str, data: CustomerCreate) -> Customer:
        opening_balance = data.opening_balance or 0.0
        customer_data = data.model_dump(exclude={"opening_balance"})
        customer = Customer(**customer_data, business_id=business_id)

        self.session.add(customer)
        await self.session.commit()

        # register pending transaction for opening balance
        transaction_service = get_transaction_service(session=self.session)

        await transaction_service.create_transaction(
            data=TransactionCreate(
                business_id=business_id,
                transaction_type="customer_deposit",
                amount=opening_balance,
                description=f"Opening balance deposit for {customer.first_name} {customer.last_name or ''}",
                meta_data={
                    "customer_id": str(customer.id),
                    "comment": "opening_deposit",
                },
            )
        )

        return customer

    async def get_customer_profile(self, customer_id: uuid.UUID) -> Optional[Customer]:
        result = await self.session.exec(
            select(Customer).where(Customer.id == customer_id)
        )

        transaction_service = get_transaction_service(session=self.session)

        profile = result.first()

        return {
            "balance": await transaction_service.get_wallet_balance(customer_id),
            **profile.__dict__,
        }

    async def get_customer_by_id(self, customer_id: uuid.UUID) -> Optional[Customer]:
        result = await self.session.exec(
            select(Customer).where(Customer.id == customer_id)
        )

        result = result.first()

        if not result:
            raise CustomerNotFound(f"Customer with ID {customer_id} not found.")

        return result

    async def update_customer(
        self, customer_id: uuid.UUID, data: CustomerUpdate
    ) -> Optional[Customer]:
        customer = await self.get_customer_by_id(customer_id)

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
        self, business_id: Optional[uuid.UUID] = None, page: int = 1, limit: int = 10
    ) -> dict:
        stmt = select(Customer)
        if business_id:
            stmt = stmt.where(Customer.business_id == business_id)
        count_stmt = select(func.count()).select_from(Customer)
        if business_id:
            count_stmt = count_stmt.where(Customer.business_id == business_id)
        total_result = await self.session.exec(count_stmt)
        total_count = total_result.one()
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.exec(stmt)
        customers = result.fetchall()

        transaction_service = get_transaction_service(session=self.session)

        customers = [
            {
                **customer.model_dump(),
                "balance": await transaction_service.get_wallet_balance(customer.id),
                # "wallet_history": customer.wallet_history,
            }
            for customer in customers
        ]
        return {
            "total": total_count,
            "page": page,
            "limit": limit,
            "customers": customers,
        }


def get_customer_service(
    session: AsyncSession = Depends(get_session),
) -> CustomerService:
    return CustomerService(session)
