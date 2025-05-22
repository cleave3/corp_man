from datetime import datetime
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import func, select, desc

from src.models import Transaction, User, Config
from src.common.permissions import admin_permission_list


class AdminService:
    async def get_all_admins(self, session: AsyncSession) -> List[User]:
        result = await session.exec(
            select(User).where(User.role == "admin").order_by(desc(User.created_at))
        )

        return result.all()

    async def get_all_users(
        self,
        session: AsyncSession,
        status: str = None,
        # start_date: str = None,
        # end_date: str = datetime.now().isoformat(),
        page: int = 1,
        limit: int = 10,
        name: str = None,
        email: str = None,
    ) -> dict:
        offset = (page - 1) * limit
        query = select(User).where(User.role == "user")

        if status in ["active", "deleted", "blocked"]:
            query = query.where(User.status == status)

        # if start_date and end_date:
        #     query = query.where(User.created_at.between(start_date, end_date))

        if name:
            query = query.where(User.name.ilike(f"%{name}%"))

        if email:
            query = query.where(User.email.ilike(f"%{email}%"))

        query = query.order_by(desc(User.created_at)).offset(offset).limit(limit)

        result = await session.exec(query)
        users = result.all()

        # Optimized count query
        count_query = select(func.count()).where(User.role == "user")

        if status in ["active", "deleted", "blocked"]:
            count_query = count_query.where(User.status == status)

        # if start_date and end_date:
        #     count_query = count_query.where(
        #         User.created_at.between(start_date, end_date)
        #     )

        if name:
            count_query = count_query.where(User.name.ilike(f"%{name}%"))

        if email:
            count_query = count_query.where(User.email.ilike(f"%{email}%"))

        total_result = await session.exec(count_query)
        total_count = total_result.one()

        # return {
        #     "users": users,
        #     "total": total_count,
        #     "page": page,
        #     "limit": limit,
        # }

        return {
            "users": users,
            "pagination": {
                "page": page,
                "page_size": limit,
                "total_records": total_count,
                "total_pages": (total_count + limit - 1) // limit,
            },
        }

    async def get_transactions(
        self,
        session: AsyncSession,
        status: str = None,
        start_date: str = None,
        end_date: str = None,
        page: int = 1,
        limit: int = 10,
    ):
        statement = select(Transaction)

        # Apply filters
        if status:
            statement = statement.where(Transaction.status == status)
        if start_date:
            statement = statement.where(Transaction.created_at >= start_date)
        if end_date:
            statement = statement.where(Transaction.created_at <= end_date)

        # Apply ordering
        statement = statement.order_by(desc(Transaction.created_at))

        # Pagination
        offset = (page - 1) * limit
        statement = statement.offset(offset).limit(limit)

        result = await session.exec(statement)
        user_transactions = result.all()

        # Count total records for pagination metadata
        count_statement = select(Transaction)
        if status:
            count_statement = count_statement.where(Transaction.status == status)
        if start_date:
            count_statement = count_statement.where(
                Transaction.created_at >= start_date
            )
        if end_date:
            count_statement = count_statement.where(Transaction.created_at <= end_date)

        total_records = await session.exec(count_statement)
        total_records_count = len(total_records.all())

        return {
            "transactions": user_transactions,
            "pagination": {
                "page": page,
                "page_size": limit,
                "total_records": total_records_count,
                "total_pages": (total_records_count + limit - 1) // limit,
            },
        }

    async def create_user(self, user_uid: str, user_data: dict, session: AsyncSession):
        new_admin = User(
            **user_data,
            role="admin",
            is_verified=True,
            accept_terms=True,
            updatedby_id=user_uid,
            has_password=True,
        )

        session.add(new_admin)
        await session.commit()

        return new_admin

    async def get_permissions(self) -> List[dict]:
        return admin_permission_list

    async def analytics(self, session: AsyncSession):
        stats = {}

        # Users who accepted terms
        accepted_terms_query = select(func.count()).where(
            User.accept_terms == True, User.role == "user"
        )
        accepted_terms_result = await session.exec(accepted_terms_query)
        stats["accepted_terms"] = accepted_terms_result.one()

        # Deleted accounts
        deleted_accounts_query = select(func.count()).where(User.status == "deleted")
        deleted_accounts_result = await session.exec(deleted_accounts_query)
        stats["deleted_accounts"] = deleted_accounts_result.one()

        # # Total number of users
        total_users_query = select(func.count()).where(User.role == "user")
        total_users_result = await session.exec(total_users_query)
        stats["total_users"] = total_users_result.one()

        # # Total number of users
        total_admin_query = select(func.count()).where(User.role == "admin")
        total_admin_result = await session.exec(total_admin_query)
        stats["total_admin"] = total_admin_result.one()

        # Monthly active users
        monthly_active_query = select(func.count()).where(
            User.updated_at >= func.date_trunc("month", func.now()), User.role == "user"
        )
        monthly_active_result = await session.exec(monthly_active_query)
        stats["monthly_active_users"] = monthly_active_result.one()

        # Daily active users
        daily_active_query = select(func.count()).where(
            User.updated_at >= func.date_trunc("day", func.now()), User.role == "user"
        )
        daily_active_result = await session.exec(daily_active_query)
        stats["daily_active_users"] = daily_active_result.one()

        # Group by subscribed and ubsubscribed users
        # subscribed_query = select(func.count()).where(Profile.is_subscribed == True)
        # subscribed_users = await session.exec(subscribed_query)
        # stats["subscribed_users"] = subscribed_users.one()

        # unsubscribed_query = select(func.count()).where(Profile.is_subscribed == False)
        # unsubscribed_users = await session.exec(unsubscribed_query)
        # stats["unsubscribed_users"] = unsubscribed_users.one()

        return stats

    async def submit_config(self, config_data: dict, session: AsyncSession):

        config = await self.get_config(session=session)

        if config is None:
            new_config = Config(**config_data)
            session.add(new_config)
            await session.commit()

            return new_config
        else:
            for k, v in config_data.items():
                setattr(config, k, v)

            await session.commit()

            return config

    async def get_config(self, session: AsyncSession):
        result = await session.exec(select(Config))

        config = result.first()

        return config