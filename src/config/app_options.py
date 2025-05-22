
from .settings import Config


is_production = Config.APP_MODE == "production"
is_staging = Config.APP_MODE == "staging"
version = "v1"

app_options = {
    "version": version,
    "title": "Corpman API",
    "description": "Corpman API Service",
    "docs_url": None if is_production else "/docs",
    "openapi_url": None if is_production else "/openapi.json",
    "redoc_url": None if is_production else "/redoc",
    "servers": [
        {
            "url": (
                "https://creditapp-api.onrender.com"
                if is_staging
                else "http://127.0.0.1:8000"
            ),
            "description": (
                "Staging Server" if is_staging else "Local Development Server"
            ),
        },
        {
            "url": (
                "http://127.0.0.1:8000"
                if is_staging
                else "https://creditapp-api.onrender.com"
            ),
            "description": (
                "Local Development Server" if is_staging else "Staging Server"
            ),
        },
    ],
    "swagger_ui_parameters": {
        "defaultModelsExpandDepth": -1,
        "displayRequestDuration": True,
    },
}