import uuid
from fastapi import APIRouter, Depends, Query, status
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
    print(user_data)
    customer = await service.create_customer(
        data=data, business_id=user_data.business_id, user_uid=user_data.uid
    )

    return response(data=customer, message="Customer created successfully", code=201)


@customer_router.get("", status_code=status.HTTP_200_OK)
async def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, gt=0),
    search: str = Query(),
    service: CustomerService = Depends(get_customer_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["view_customers"]]
        )
    ),
):
    result = await service.paginated_get_customers(
        business_id=user_data.business_id, page=page, limit=limit, search=search
    )
    return response(data=result)


@customer_router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_customers(
    service: CustomerService = Depends(get_customer_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[
                user_permission_actions["view_customers"],
                user_permission_actions["initiate_transaction"],
            ]
        )
    ),
):
    result = await service.get_customers(business_id=user_data.business_id)
    return response(data=result)


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
