import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.enums import TransactionStatusEnum, TransactionTypeEnum
from src.config.db import get_session
from src.models import Transaction, Wallet

from .schema import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_transaction(self, data: TransactionCreate) -> Transaction:
        transaction = Transaction(
            **data.model_dump(), status=TransactionStatusEnum.pending.value
        )
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return transaction

    async def get_transaction_by_id(
        self, transaction_id: uuid.UUID
    ) -> Optional[Transaction]:
        result = await self.session.exec(
            select(Transaction).where(Transaction.id == transaction_id)
        )
        return result.first()

    async def update_transaction(
        self, transaction_id: uuid.UUID, data: TransactionUpdate
    ) -> Optional[Transaction]:
        transaction = await self.get_transaction_by_id(transaction_id)
        if not transaction:
            return None

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(transaction, key, value)

        transaction.updated_at = datetime.now()
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return transaction

    async def delete_transaction(self, transaction_id: uuid.UUID) -> bool:
        transaction = await self.get_transaction_by_id(transaction_id)
        if not transaction:
            return False

        await self.session.delete(transaction)
        await self.session.commit()
        return True

    async def paginated_get_transactions(
        self,
        business_id: Optional[uuid.UUID] = None,
        status: Optional[str] = None,
        description: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
        limit: int = 10,
    ):
        offset = (page - 1) * limit
        stmt = select(Transaction)

        if business_id:
            stmt = stmt.where(Transaction.business_id == business_id)
        if status:
            stmt = stmt.where(Transaction.status == status)
        if description:
            stmt = stmt.where(Transaction.description.ilike(f"%{description}%"))
        if start_date:
            stmt = stmt.where(Transaction.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Transaction.created_at <= end_date)

        total_result = await self.session.exec(stmt)
        total = total_result.count()

        stmt = stmt.offset(offset).limit(limit)
        result = await self.session.exec(stmt)
        transactions = result.scalars().all()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": transactions,
        }

    async def approve_transaction(
        self, transaction_id: uuid.UUID
    ) -> Optional[Transaction]:
        transaction = await self.get_transaction_by_id(transaction_id)

        if not transaction:
            return None

        if transaction.status != TransactionStatusEnum.pending.value:
            return None

        customer_id = transaction.meta_data.get("customer_id")

        if customer_id:
            credit = (
                transaction.amount
                if transaction.transaction_type
                == TransactionTypeEnum.customer_deposit.value
                else 0.0
            )
            debit = (
                transaction.amount
                if transaction.transaction_type == TransactionTypeEnum.payout.value
                else 0.0
            )
            await self._insert_into_wallet(
                customer_id=customer_id,
                credit=credit,
                debit=debit,
                description=transaction.description,
            )

        transaction.status = TransactionStatusEnum.completed.value
        transaction.updated_at = datetime.now()

        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return transaction

    async def get_wallet_by_customer(
        self,
        customer_id: uuid.UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        offset: int = 0,
        limit: int = 10,
    ):
        stmt = select(Wallet).where(Wallet.customer_id == customer_id)
        if start_date:
            stmt = stmt.where(Wallet.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Wallet.created_at <= end_date)

        # Use func.count for total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.exec(count_stmt)
        total = total_result.one() or 0

        stmt = stmt.offset(offset).limit(limit)
        result = await self.session.exec(stmt)
        wallets = result.fetchall()

        return {
            "total": total,
            "offset": offset,
            "limit": limit,
            "items": wallets,
        }

    async def _insert_into_wallet(
        self,
        customer_id: uuid.UUID,
        credit: float = 0.0,
        debit: float = 0.0,
        description: str = None,
    ) -> Wallet:
        wallet = Wallet(
            customer_id=customer_id, credit=credit, debit=debit, description=description
        )
        self.session.add(wallet)
        await self.session.commit()
        await self.session.refresh(wallet)
        return wallet

    async def get_wallet_balance(self, customer_id: uuid.UUID) -> Optional[float]:
        credit_result = await self.session.exec(
            select(func.sum(Wallet.credit)).where(Wallet.customer_id == customer_id)
        )
        total_credit = credit_result.one() or 0.0

        debit_result = await self.session.exec(
            select(func.sum(Wallet.debit)).where(Wallet.customer_id == customer_id)
        )
        total_debit = debit_result.one() or 0.0

        return total_credit - total_debit

    async def get_total_wallet_balance(self) -> Optional[float]:
        credit_result = await self.session.exec(select(func.sum(Wallet.credit)))
        total_credit = credit_result.first() or 0.0

        debit_result = await self.session.exec(select(func.sum(Wallet.debit)))
        total_debit = debit_result.first() or 0.0

        return total_credit - total_debit


def get_transaction_service(
    session: AsyncSession = Depends(get_session),
) -> TransactionService:
    return TransactionService(session)
