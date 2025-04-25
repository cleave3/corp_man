from fastapi import Depends, FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.common.schema import BaseResponseModel
from src.common.utilities import response
from src.modules.auth.routes import auth_router
from src.modules.admin.routes import admin_router
from src.common.errors import register_all_errors
from src.middleware.middleware import register_middleware
from contextlib import asynccontextmanager
from src.config import init_db
from src.modules.auth.dependencies import RoleChecker
from .common.errors import register_all_errors


@asynccontextmanager
async def life_span(app: FastAPI):
    print(f"server is starting...")
    await init_db()
    yield
    print(f"server has been stopped")


version = "v1"

version_prefix = f"/api/{version}"

app = FastAPI(
    version=version,
    title="Corpman API",
    description="Corpman API Servivce",
    summary="",
    openapi_tags=[
        {
            "name": "Onboarding",
            "description": "Section contains the user onboarding journey",
        },
        {
            "name": "Admin",
            "description": "Section contains the Administrative functionalities",
        },
        {
            "name": "Default",
            "description": "App entry routes",
        },
    ],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            **response(
                error=exc.errors()[0],
                code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message="validation errors",
            )
        },
    )


app.mount("/static", StaticFiles(directory="static"), name="static")

register_all_errors(app)

register_middleware(app)


@app.get(
    "/",
    description="App entry",
    tags=["Default"],
    response_model=BaseResponseModel,
    status_code=200,
)
def app_entry():
    return response(message="corp-man is live 🚀")


app.include_router(
    auth_router, tags=["Onboarding"], prefix=f"{version_prefix}/auth"
)
app.include_router(
    admin_router,
    tags=["Admin"],
    prefix=f"{version_prefix}/admin",
    dependencies=[Depends(RoleChecker("user"))],
)
