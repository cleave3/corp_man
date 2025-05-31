import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.utilities import calculate_next_payment_date
from src.common.enums import TransactionStatusEnum, TransactionTypeEnum
from src.common.errors import BadRequest, CustomerNotFound, TransactionNotFound
from src.config.db import get_session
from src.models import Customer, Transaction, TransactionApproval, Wallet

from .schema import TransactionCreate


class TransactionService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _format_response(self, transaction: Transaction) -> dict:
        return {
            **transaction.model_dump(),
            "initiator": {
                "name": f"{getattr(transaction.initiator, 'first_name', '')} {getattr(transaction.initiator, 'last_name', '')}"
            },
            "approvers": await self.get_approvals_by_transaction_id(transaction.id),
            "updated_by": {
                "name": f"{getattr(transaction.updated_by, 'first_name', '')} {getattr(transaction.updated_by, 'last_name', '')}"
            },
        }

    async def get_approvals_by_transaction_id(
        self, transaction_id: uuid.UUID
    ) -> List[TransactionApproval]:
        result = await self.session.exec(
            select(TransactionApproval).where(
                TransactionApproval.transaction_id == transaction_id
            )
        )
        approvals = result.fetchall()

        return [
            {
                **approval.model_dump(),
                "approver": {
                    "name": f"{approval.approver.first_name} {approval.approver.last_name}"
                },
            }
            for approval in approvals
        ]

    async def get_approvals_by_user_id_and_transaction_id(
        self, user_id: str, transaction_id: uuid.UUID
    ) -> Optional[TransactionApproval]:
        result = await self.session.exec(
            select(TransactionApproval).where(
                TransactionApproval.user_id == user_id,
                TransactionApproval.transaction_id == transaction_id,
            )
        )
        return result.first()

    async def create_transaction(
        self, user_uid: str, business_id: str, data: TransactionCreate
    ) -> Transaction:
        transaction = Transaction(
            **data.model_dump(),
            status=TransactionStatusEnum.pending.value,
            initiator_id=user_uid,
            business_id=business_id,
            number_of_required_approval=1,
            requires_approval=True,
        )
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return await self._format_response(transaction)

    async def get_transaction_by_id(
        self, transaction_id: uuid.UUID
    ) -> Optional[Transaction]:
        result = await self.session.exec(
            select(Transaction).where(Transaction.id == transaction_id)
        )

        result = result.first()

        if not result:
            raise TransactionNotFound()

        return result

    async def update_transaction(
        self, transaction_id: uuid.UUID, data: dict
    ) -> Optional[Transaction]:
        transaction = await self.get_transaction_by_id(transaction_id)

        for key, value in data.items():
            setattr(transaction, key, value)
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return await self._format_response(transaction)

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
        count_stmt = select(func.count()).select_from(Transaction)

        if business_id:
            stmt = stmt.where(Transaction.business_id == business_id)
            count_stmt = count_stmt.where(Transaction.business_id == business_id)
        if status:
            stmt = stmt.where(Transaction.status == status)
            count_stmt = count_stmt.where(Transaction.status == status)
        if description:
            stmt = stmt.where(Transaction.description.ilike(f"%{description}%"))
            count_stmt = count_stmt.where(
                Transaction.description.ilike(f"%{description}%")
            )
        if start_date:
            stmt = stmt.where(Transaction.created_at >= start_date)
            count_stmt = count_stmt.where(Transaction.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Transaction.created_at <= end_date)
            count_stmt = count_stmt.where(Transaction.created_at <= end_date)

        stmt = stmt.offset(offset).limit(limit).order_by(Transaction.created_at.desc())
        result = await self.session.exec(stmt)
        count_result = await self.session.exec(count_stmt)
        transactions = result.fetchall()
        total_count = count_result.one()

        return {
            "total": total_count,
            "page": page,
            "limit": limit,
            "transactions": [
                await self._format_response(transaction) for transaction in transactions
            ],
        }

    async def approve_transaction(
        self,
        transaction_id: uuid.UUID,
        user_uid: str,
    ) -> Optional[Transaction]:
        transaction = await self.get_transaction_by_id(transaction_id=transaction_id)

        if not transaction:
            raise TransactionNotFound()

        if transaction.status != TransactionStatusEnum.pending.value:
            raise BadRequest("Transaction is not pending")

        all_approvals = await self.get_approvals_by_transaction_id(transaction_id)

        if len(all_approvals) == transaction.number_of_required_approval:
            raise BadRequest("Transaction Already approved")

        has_approved = await self.get_approvals_by_user_id_and_transaction_id(
            user_id=user_uid, transaction_id=transaction_id
        )

        if has_approved:
            raise BadRequest("You have already approved this transaction")

        transaction.status = TransactionStatusEnum.completed.value
        transaction.updated_at = datetime.now()

        self.session.add(
            TransactionApproval(transaction_id=transaction.id, user_id=user_uid)
        )

        self.session.add(transaction)

        if transaction.transaction_type in {
            TransactionTypeEnum.customer_deposit.value,
            TransactionTypeEnum.payout.value,
        }:
            customer_id = transaction.meta_data.get("customer_id")

            result = await self.session.exec(
                select(Customer).where(Customer.id == customer_id)
            )

            customer = result.first()

            if not customer:
                raise CustomerNotFound(f"Customer with ID {customer_id} not found.")

            submitted_next_payment = transaction.meta_data.get("next_payment_date")

            next_payment_date = (
                datetime.strptime(submitted_next_payment, "%Y-%m-%d")
                if submitted_next_payment
                else calculate_next_payment_date(
                    next_payment_date=customer.next_payment_date,
                    frequency=customer.payment_frequency,
                )
            )

            customer.next_payment_date = next_payment_date

            self.session.add(customer)

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

        await self.session.commit()

        await self._insert_into_wallet(
            customer_id=customer_id,
            credit=credit,
            debit=debit,
            description=transaction.description,
        )

        return await self._format_response(transaction)

    async def decline_transaction(
        self, transaction_id: uuid.UUID
    ) -> Optional[Transaction]:
        transaction = await self.get_transaction_by_id(transaction_id)

        if transaction.status != TransactionStatusEnum.pending.value:
            raise BadRequest("Transaction is not pending")

        transaction.status = TransactionStatusEnum.cancelled.value
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return await self._format_response(transaction)

    async def get_wallet_by_customer(
        self,
        customer_id: uuid.UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
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

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.exec(stmt)
        wallets = result.fetchall()

        wallets = [
            {
                **wallet.model_dump(),
                "balance": await self.get_wallet_balance(wallet.customer_id),
            }
            for wallet in wallets
        ]

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "wallet_history": wallets,
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
