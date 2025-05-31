from fastapi import APIRouter, status, Depends, Query

from src.modules.analytics.service import get_analytics_service
from src.common.utilities import response
from .service import AnalyticsService

analytics_router = APIRouter()


@analytics_router.get("/overview-stats", status_code=status.HTTP_200_OK)
async def get_overview_stats(
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    stats = await analytics_service.get_overview_stats()

    return response(data=stats)


@analytics_router.get("/transactions-initiator-stats", status_code=status.HTTP_200_OK)
async def get_transactions_count_by_initiator(
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    stats = await analytics_service.get_transactions_count_by_initiator()

    return response(data=stats)


@analytics_router.get("/transaction-year-stats", status_code=status.HTTP_200_OK)
async def get_transactions_amount_by_filter(
    year: int = Query(2025, ge=2025),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    stats = await analytics_service.get_transactions_amount_by_filter(year=year)

    return response(data=stats)

@analytics_router.get("/due-collections", status_code=status.HTTP_200_OK)
async def get_customers_with_due_collections(
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    customers = await analytics_service.get_customers_with_due_collections()

    return response(data=customers)
