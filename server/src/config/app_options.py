from .settings import Config

is_production = Config.APP_MODE == "production"
version = "v1"

app_options = {
    "version": version,
    "title": "Corpman API",
    "description": "Corpman API Service",
    "docs_url": None if is_production else "/docs",
    "openapi_url": None if is_production else "/openapi.json",
    "redoc_url": None if is_production else "/redoc",
    "swagger_ui_parameters": {
        "defaultModelsExpandDepth": -1,
        "displayRequestDuration": True,
        "docExpansion": "none",
    },
}