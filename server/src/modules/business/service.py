from typing import Optional
from uuid import UUID
from fastapi import Depends
from sqlmodel import select, func
from sqlalchemy import select as sa_select

from sqlmodel.ext.asyncio.session import AsyncSession

from src.config.db import get_session
from .schema import BusinessCreate, BusinessPreferenceSubmit
from src.models import Business, BusinessPreference


class BusinessService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def submit_business(self, business_id: str, data: BusinessCreate) -> Business:
        result = await self.session.exec(
            select(Business).where(Business.id == business_id)
        )
        existing = result.first()

        if existing:
            for field, value in data.model_dump(exclude_unset=True).items():
                setattr(existing, field, value)
        else:
            existing = Business(**data.model_dump())
            self.session.add(existing)
            await self.session.commit()

            self.session.add(
                BusinessPreference(
                    business_id=existing.id, sms_id=existing.business_name[:10]
                )
            )

        self.session.add(existing)
        await self.session.commit()
        await self.session.refresh(existing)
        return existing.__dict__

    async def update_preferences(
        self, business_id: str, data: BusinessPreferenceSubmit
    ) -> BusinessPreference:
        result = await self.session.exec(
            select(BusinessPreference).where(
                BusinessPreference.business_id == business_id
            )
        )
        preferences = result.first()

        if preferences:
            for field, value in data.model_dump(exclude_unset=True).items():
                setattr(preferences, field, value)
        else:
            preferences = BusinessPreference(
                **data.model_dump(), business_id=business_id
            )
            self.session.add(preferences)

        self.session.add(preferences)
        await self.session.commit()
        await self.session.refresh(preferences)
        return preferences

    async def get_paginated_businesses(self, skip: int = 0, limit: int = 10) -> dict:
        # Total count
        count_stmt = sa_select(func.count()).select_from(Business)
        total_result = await self.session.exec(count_stmt)
        total = total_result.scalar_one()

        # Paged data
        stmt = select(Business).offset(skip).limit(limit)
        result = await self.session.exec(stmt)
        businesses = result.all()

        return {"items": businesses, "total": total, "skip": skip, "limit": limit}

    async def get_business_by_id(self, business_id: UUID):
        result = await self.session.exec(
            select(Business).where(Business.id == business_id)
        )

        return result.first()

    async def update_business(
        self, business_id: UUID, data: BusinessCreate
    ) -> Optional[Business]:
        business = await self.get_business_by_id(business_id)
        if not business:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(business, field, value)

        self.session.add(business)
        await self.session.commit()
        await self.session.refresh(business)
        return business


def get_business_service(
    session: AsyncSession = Depends(get_session),
) -> BusinessService:
    return BusinessService(session)
