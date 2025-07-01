import asyncio
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends
from src.modules.auth.service import AuthService
from src.common.enums import TransactionTypeEnum
from src.config.db import get_session
from src.models import Customer, Wallet, Transaction, Auth
from datetime import date


class AnalyticsService(AuthService):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def total_users(self):
        result = await self.session.exec(select(func.count()).select_from(Auth))
        return result.one()

    async def total_staffs(self):
        result = await self.session.exec(
            select(func.count()).select_from(Auth).where(Auth.user_type == "staff")
        )
        return result.one()

    async def total_customers(self):
        result = await self.session.exec(select(func.count()).select_from(Customer))
        return result.one()

    async def total_balances(self):
        credit_sum_result = await self.session.exec(
            select(func.coalesce(func.sum(Wallet.credit), 0))
        )
        debit_sum_result = await self.session.exec(
            select(func.coalesce(func.sum(Wallet.debit), 0))
        )
        credit_sum = credit_sum_result.one()
        debit_sum = debit_sum_result.one()
        return credit_sum - debit_sum

    async def total_transaction_amount_by_type(
        self, type: str, month: int = None, year: int = None
    ):
        query = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            (Transaction.transaction_type == type) & (Transaction.status == "completed")
        )
        if year is not None:
            query = query.where(func.extract("year", Transaction.created_at) == year)
        if month is not None:
            query = query.where(func.extract("month", Transaction.created_at) == month)
        result = await self.session.exec(query)
        return result.one()

    async def total_due_collections(self):
        today = date.today()
        result = await self.session.exec(
            select(func.count())
            .select_from(Customer)
            .where(Customer.next_payment_date <= today)
        )
        return result.one()

    async def get_customers_with_due_collections(self):
        today = date.today()
        result = await self.session.exec(
            select(Customer).where(Customer.next_payment_date <= today)
        )
        return result.fetchall()

    async def total_transactions_status(self, status: str = None):
        query = select(func.count()).select_from(Transaction)

        if status:
            query = query.where(Transaction.status == status)

        result = await self.session.exec(query)

        return result.one()

    async def top_savers(self, limit: int = 10):
        stmt = (
            select(
                Wallet,
                (
                    func.coalesce(func.sum(Wallet.credit), 0)
                    - func.coalesce(func.sum(Wallet.debit), 0)
                ).label("balance"),
            )
            .group_by(Wallet.customer_id)
            .order_by(
                func.coalesce(func.sum(Wallet.credit), 0)
                - func.coalesce(func.sum(Wallet.debit), 0).desc()
            )
            .limit(limit)
        )
        result = await self.session.exec(stmt)
        top_savers = result.all()

        # top_savers = [
        #     {
        #         **saver.model_dump(),
        #         "customer": {
        #             "name": saver.
        #         }
        #     }
        #     for saver in top_savers
        # ]

        return top_savers

    async def get_transactions_count_by_initiator(self, month: int, year: int):
        (
            result,
            total_customer_deposits,
            total_payouts,
            total_income,
        ) = await asyncio.gather(
            self.session.exec(
                select(
                    Transaction.initiator_id,
                    func.count().label("count"),
                    func.coalesce(func.sum(Transaction.amount), 0).label(
                        "collection_volume"
                    ),
                )
                .where(
                    (Transaction.status == "completed")
                    & (Transaction.transaction_type == "customer_deposit")
                    & (func.extract("year", Transaction.created_at) == year)
                    & (func.extract("month", Transaction.created_at) == month)
                )
                .group_by(
                    Transaction.initiator_id,
                )
                .order_by(func.coalesce(func.sum(Transaction.amount), 0).desc())
            ),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.customer_deposit.value, month=month, year=year
            ),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.payout.value, month=month, year=year
            ),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.income.value, month=month, year=year
            ),
        )

        rows = result.all()

        return {
            "total_customer_deposits": total_customer_deposits,
            "total_payouts": total_payouts,
            "total_income": total_income,
            "collectors_stats": [
                {
                    "collection_volume": collection_volume,
                    "initiator_id": initiator_id,
                    "count": count,
                    "name": await self.get_user_name_by_id(initiator_id),
                }
                for initiator_id, count, collection_volume in rows
            ],
        }

    async def get_transactions_amount_by_filter(self, year: int):
        data = []
        for month in range(1, 13):
            result = await self.session.exec(
                select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                    (func.extract("year", Transaction.created_at) == year)
                    & (func.extract("month", Transaction.created_at) == month)
                    & (Transaction.transaction_type == "customer_deposit")
                    & (Transaction.status == "completed")
                )
            )
            amount = result.one()
            month_str = date(1900, month, 1).strftime("%b")
            data.append({"month": month_str, "amount": amount})
        return data

    async def get_overview_stats(self):

        (
            total_users,
            total_staffs,
            total_customers,
            total_balances,
            total_due_collections,
            total_pending_transactions,
            total_completed_transactions,
            total_cancelled_transactions,
            total_customer_deposits,
            total_payouts,
            total_income,
        ) = await asyncio.gather(
            self.total_users(),
            self.total_staffs(),
            self.total_customers(),
            self.total_balances(),
            self.total_due_collections(),
            self.total_transactions_status(status="pending"),
            self.total_transactions_status(status="completed"),
            self.total_transactions_status(status="cancelled"),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.customer_deposit.value
            ),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.payout.value
            ),
            self.total_transaction_amount_by_type(
                type=TransactionTypeEnum.income.value
            ),
        )

        return {
            "total_users": total_users,
            "total_staffs": total_staffs,
            "total_customers": total_customers,
            "total_balances": total_balances,
            "total_due_collections": total_due_collections,
            "total_pending_transactions": total_pending_transactions,
            "total_completed_transactions": total_completed_transactions,
            "total_cancelled_transactions": total_cancelled_transactions,
            "total_customer_deposits": total_customer_deposits,
            "total_payouts": total_payouts,
            "total_income": total_income,
        }


def get_analytics_service(
    session: AsyncSession = Depends(get_session),
) -> AnalyticsService:
    return AnalyticsService(session)
