import os
from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from src.common.notification import NotificationService
from src.middleware.dependencies import PermissionChecker
from src.common.utilities import response
from src.common.permissions import user_permission_actions
from src.modules.auth.routes import auth_router
from src.modules.admin.routes import admin_router
from src.modules.business.routes import busines_router
from src.modules.customers.routes import customer_router
from src.modules.transaction.routes import transaction_router
from src.modules.analytics.routes import analytics_router
from src.middleware.middleware import register_middleware
from src.config.app_options import app_options
from .common.errors import register_all_errors
from fastapi.responses import FileResponse

version_prefix = f"/api/{app_options['version']}"

app = FastAPI(**app_options)

app.mount("/static", StaticFiles(directory="static"), name="static")

register_all_errors(app)

register_middleware(app)


@app.get("/", status_code=200, include_in_schema=False)
def app_entry():
    NotificationService.send_sms(
        telephone="08165124558",
        message=f"Hello Cleave, your account has been created successfully.",
    )
    return response(message="Corpman API is live 🚀")


@app.get("/error-log", status_code=200, include_in_schema=False)
def download_error_log():
    log_file_path = "error.log"
    if os.path.exists(log_file_path):
        return FileResponse(
            path=log_file_path, media_type="text/plain", filename="error.log"
        )
    return response(message="No error.log file found", status_code=404)


app.include_router(
    analytics_router,
    tags=["Analytics"],
    prefix=f"{version_prefix}/analytics",
    dependencies=[
        Depends(
            PermissionChecker(
                allowed_permissions=[
                    user_permission_actions["dashboard_overview"],
                    user_permission_actions["dashboard_revenue"],
                    user_permission_actions["dashboard_target"],
                    user_permission_actions["dashboard_due_payments"],
                    user_permission_actions["dashboard_pending"],
                    user_permission_actions["dashboard_notifications"],
                ]
            )
        )
    ],
)
app.include_router(auth_router, tags=["Onboarding"], prefix=f"{version_prefix}/auth")
app.include_router(admin_router, tags=["Admin"], prefix=f"{version_prefix}/admin")
app.include_router(
    busines_router, tags=["Business"], prefix=f"{version_prefix}/business"
)
app.include_router(
    customer_router, tags=["Customer"], prefix=f"{version_prefix}/customer"
)
app.include_router(
    transaction_router, tags=["Transaction"], prefix=f"{version_prefix}/transaction"
)
