from fastapi import APIRouter, Depends, HTTPException, Query, status
from uuid import UUID

from src.common.utilities import response
from src.middleware.dependencies import PermissionChecker

from .service import BusinessService, get_business_service
from .schema import BusinessCreate, BusinessPreferenceSubmit
from src.common.permissions import user_permission_actions

busines_router = APIRouter()


@busines_router.post("", status_code=status.HTTP_200_OK)
async def submit_business(
    data: BusinessCreate,
    service: BusinessService = Depends(get_business_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["update_business"]]
        )
    ),
):
    result = await service.submit_business(data=data, business_id=user_data.business_id)

    return response(data=result)

@busines_router.get("/me", status_code=status.HTTP_200_OK)
async def get_my_business_info(
    service: BusinessService = Depends(get_business_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["view_business"]]
        )
    ),
):
    business = await service.get_business_by_id(business_id=user_data.business_id)

    return response(data=business.__dict__)

@busines_router.patch("/preferences", status_code=status.HTTP_200_OK)
async def submit_business(
    data: BusinessPreferenceSubmit,
    service: BusinessService = Depends(get_business_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["update_business_preferences"]]
        )
    ),
):
    result = await service.update_preferences(data=data, business_id=user_data.business_id)

    return response(data=result)

# @busines_router.get("/", status_code=status.HTTP_200_OK)
# async def get_businesses(
#     skip: int = Query(0, ge=0),
#     limit: int = Query(10, ge=1, le=100),
#     service: BusinessService = Depends(get_business_service),
# ):
#     return await service.get_paginated_businesses(skip=skip, limit=limit)

# @busines_router.put(
#     "/{business_id}",
#     status_code=status.HTTP_200_OK,
# )
# async def update_business(
#     business_id: UUID,
#     data: BusinessCreate,
#     service: BusinessService = Depends(get_business_service),
# ):
#     updated = await service.update_business(business_id, data)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Business not found")
#     return updated
