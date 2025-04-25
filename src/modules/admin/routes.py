from fastapi import APIRouter, status


admin_router = APIRouter()

@admin_router.get("", status_code=status.HTTP_200_OK)
async def get_admins():
    pass