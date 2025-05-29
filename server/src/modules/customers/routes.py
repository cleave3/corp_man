import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from src.common.utilities import response
from src.middleware.dependencies import PermissionChecker
from .schema import CustomerCreate, CustomerUpdate
from .service import CustomerService, get_customer_service
from src.common.permissions import user_permission_actions

customer_router = APIRouter()


@customer_router.post("", status_code=status.HTTP_201_CREATED)
async def create_customer(
    data: CustomerCreate,
    service: CustomerService = Depends(get_customer_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["create_customers"]]
        )
    ),
):
    customer = await service.create_customer(
        data=data, business_id=user_data.business_id
    )

    return response(data=customer, message="Customer created successfully", code=201)


@customer_router.get(
    "",
    status_code=status.HTTP_200_OK,
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["view_customers"]]
            )
        )
    ],
)
async def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, gt=0),
    service: CustomerService = Depends(get_customer_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["create_customers"]]
        )
    ),
):
    result = await service.paginated_get_customers(
        business_id=user_data.business_id, page=page, limit=limit
    )
    return result


@customer_router.get(
    "/{customer_id}",
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["view_customers"]]
            )
        )
    ],
)
async def get_customer_by_id(
    customer_id: uuid.UUID,
    service: CustomerService = Depends(get_customer_service),
):
    customer = await service.get_customer_profile(customer_id)
    return response(data=customer)


@customer_router.patch(
    "/{customer_id}",
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["update_customers"]]
            )
        )
    ],
)
async def update_customer(
    customer_id: uuid.UUID,
    data: CustomerUpdate,
    service: CustomerService = Depends(get_customer_service),
):
    updated = await service.update_customer(customer_id, data)

    return response(data=updated, message="Customer updated successfully")


# @customer_router.delete(
#     "/{customer_id}",
#     status_code=status.HTTP_204_NO_CONTENT,
#     dependencies=[
#         Depends(
#             PermissionChecker(
#                 allowed_permissions=[user_permission_actions["delete_customers"]]
#             )
#         )
#     ],
# )
# async def delete_customer(
#     customer_id: uuid.UUID,
#     service: CustomerService = Depends(get_customer_service),
# ):
#     deleted = await service.delete_customer(customer_id)
#     if not deleted:
#         raise HTTPException(status_code=404, detail="Customer not found")
