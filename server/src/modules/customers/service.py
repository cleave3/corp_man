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

    async def create_customer(
        self, business_id: str, user_uid: str, data: CustomerCreate
    ) -> Customer:
        opening_balance = data.opening_balance or 0.0
        customer_data = data.model_dump(exclude={"opening_balance"})
        customer = Customer(
            **customer_data, business_id=business_id, creator_id=user_uid
        )

        self.session.add(customer)
        await self.session.commit()

        # register pending transaction for opening balance
        transaction_service = get_transaction_service(session=self.session)

        await transaction_service.create_transaction(
            user_uid=user_uid,
            business_id=business_id,
            data=TransactionCreate(
                transaction_type="customer_deposit",
                amount=opening_balance,
                description=f"Opening balance deposit for {customer.name or ''}",
                meta_data={
                    "customer_id": str(customer.id),
                    "comment": "opening_deposit",
                    "customer": f"{customer.name or ''}",
                },
            ),
        )

        return customer

    async def get_customer_profile(self, customer_id: uuid.UUID) -> Optional[Customer]:
        result = await self.session.exec(
            select(Customer).where(Customer.id == customer_id)
        )

        transaction_service = get_transaction_service(session=self.session)

        profile = result.first()

        creator = getattr(profile, "creator", None)

        return {
            "balance": await transaction_service.get_wallet_balance(customer_id),
            **profile.model_dump(),
            "creator": {
                "name": f"{getattr(creator, 'first_name', None)} {getattr(creator, 'last_name', None)}",
            },
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
        self,
        business_id: Optional[uuid.UUID] = None,
        page: int = 1,
        limit: int = 10,
        search: str = None,
        customer_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> dict:
        stmt = select(Customer).order_by(Customer.created_at.desc())
        count_stmt = select(func.count()).select_from(Customer)

        if business_id:
            stmt = stmt.where(Customer.business_id == business_id)
            count_stmt = count_stmt.where(Customer.business_id == business_id)

        if search:
            search_filter = (
                (Customer.name.ilike(f"%{search}%"))
                | (Customer.email.ilike(f"%{search}%"))
                | (Customer.customer_code.ilike(f"%{search}%"))
                | (Customer.customer_type.ilike(f"%{search}%"))
                | (Customer.phone.ilike(f"%{search}%"))
            )
            stmt = stmt.where(search_filter)
            count_stmt = count_stmt.where(search_filter)
        if customer_type:
            stmt = stmt.where(Customer.customer_type == customer_type)
            count_stmt = count_stmt.where(Customer.customer_type == customer_type)
        if start_date:
            stmt = stmt.where(Customer.created_at >= start_date)
            count_stmt = count_stmt.where(Customer.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Customer.created_at <= end_date)
            count_stmt = count_stmt.where(Customer.created_at <= end_date)

        total_result = await self.session.exec(count_stmt)
        total_count = total_result.one()
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.exec(stmt)
        customers = result.fetchall()

        transaction_service = get_transaction_service(session=self.session)

        customers = [
            {
                **customer.model_dump(),
                "creator": (
                    {
                        "name": f"{getattr(customer.creator, 'first_name', '')} {getattr(customer.creator, 'last_name', '')}",
                    }
                    if customer.creator
                    else {}
                ),
                "balance": await transaction_service.get_wallet_balance(customer.id),
            }
            for customer in customers
        ]
        return {
            "total": total_count,
            "page": page,
            "limit": limit,
            "customers": customers,
        }

    async def get_customers(self, business_id: Optional[uuid.UUID] = None) -> dict:
        stmt = select(Customer).order_by(Customer.created_at.desc())
        if business_id:
            stmt = stmt.where(Customer.business_id == business_id)
        result = await self.session.exec(stmt)
        customers = result.fetchall()

        # transaction_service = get_transaction_service(session=self.session)

        # customers = [
        #     {
        #         "id": customer.id,
        #         "name": f"{customer.first_name} {customer.last_name}",
        #         "phone": customer.phone,
        #         "customer_code": customer.customer_code,
        #         "balance": await transaction_service.get_wallet_balance(customer.id),
        #     }
        #     for customer in customers
        # ]
        return customers


def get_customer_service(
    session: AsyncSession = Depends(get_session),
) -> CustomerService:
    return CustomerService(session)
