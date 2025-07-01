import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse

from src.middleware.dependencies import PermissionChecker
from src.common.permissions import user_permission_actions
from src.common.utilities import response

from .schema import TransactionCreate
from .service import TransactionService, get_transaction_service
from datetime import datetime

transaction_router = APIRouter()


@transaction_router.get(
    "/download-statement/{customer_id}", status_code=status.HTTP_200_OK
)
async def generate_wallet_statement(
    customer_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    service: TransactionService = Depends(get_transaction_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[
                user_permission_actions["view_transactions"],
            ]
        )
    ),
):
    start_dt = datetime.fromisoformat(start_date) if start_date else None
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        end_dt = end_dt.replace(hour=23, minute=59, second=59, microsecond=999999)
    else:
        end_dt = None

    result = await service.get_wallet_report_by_customer(
        business_id=user_data.business_id,
        customer_id=customer_id,
        start_date=start_dt,
        end_date=end_dt,
    )

    return StreamingResponse(
        result,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=wallet_statement.pdf"},
    )


@transaction_router.post("", status_code=status.HTTP_201_CREATED)
async def create_transaction(
    data: TransactionCreate,
    service: TransactionService = Depends(get_transaction_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["initiate_transaction"]]
        )
    ),
):
    transaction = await service.create_transaction(
        data=data, business_id=user_data.business_id, user_uid=user_data.uid
    )

    return response(
        data=transaction,
        message=("Transaction created successfully"),
    )


@transaction_router.get(
    "/{transaction_id}",
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["view_transactions"]]
            )
        ),
    ],
)
async def get_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    transaction = await service.get_transaction_by_id(transaction_id)

    return response(data=transaction)


# @transaction_router.patch(
#     "/{transaction_id}",
# )
# async def update_transaction(
#     transaction_id: uuid.UUID,
#     data: TransactionUpdate,
#     service: TransactionService = Depends(get_transaction_service),
#     user_data=Depends(
#         PermissionChecker(
#             allowed_permissions=[user_permission_actions["modify_transaction"]]
#         )
#     ),
# ):
#     updated = await service.update_transaction(
#         transaction_id=transaction_id,
#         data={**data.model_dump(exclude_unset=True), "updated_by_id": user_data.uid},
#     )

#     return response(
#         data=updated,
#         message="Transaction updated successfully",
#     )


@transaction_router.get("", status_code=status.HTTP_200_OK)
async def list_transactions(
    page: Optional[int] = None,
    limit: Optional[int] = None,
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    service: TransactionService = Depends(get_transaction_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["view_transactions"]]
        )
    ),
):
    start_dt = datetime.fromisoformat(start_date) if start_date else None
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        end_dt = end_dt.replace(hour=23, minute=59, second=59, microsecond=999999)
    else:
        end_dt = None

    transactions = await service.paginated_get_transactions(
        business_id=user_data.business_id,
        page=page,
        limit=limit,
        status=status,
        start_date=start_dt,
        end_date=end_dt,
    )
    return response(data={**transactions})


@transaction_router.patch(
    "/{transaction_id}/approve",
)
async def approve_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
    user_data=Depends(
        PermissionChecker(
            allowed_permissions=[user_permission_actions["approve_transaction"]]
        )
    ),
):
    approved = await service.approve_transaction(
        transaction_id=transaction_id, user_uid=user_data.uid
    )
    return response(
        data=approved,
        message="Transaction approved successfully",
    )


@transaction_router.patch(
    "/{transaction_id}/decline",
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[user_permission_actions["approve_transaction"]]
            )
        )
    ],
)
async def decline_transaction(
    transaction_id: uuid.UUID,
    service: TransactionService = Depends(get_transaction_service),
):
    declined = await service.decline_transaction(transaction_id=transaction_id)
    return response(
        data=declined,
        message="Transaction declined successfully",
    )


@transaction_router.get("/wallet-history/{customer_id}")
async def get_wallet_balance(
    customer_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, gt=0),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    service: TransactionService = Depends(get_transaction_service),
):
    start_dt = datetime.fromisoformat(start_date) if start_date else None
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        end_dt = end_dt.replace(hour=23, minute=59, second=59, microsecond=999999)
    else:
        end_dt = None

    wallet = await service.get_wallet_by_customer(
        customer_id=customer_id,
        page=page,
        limit=limit,
        start_date=start_dt,
        end_date=end_dt,
    )
    return response(data=wallet)
