from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import time
import logging

logger = logging.getLogger("uvicorn.access")
logger.disabled = True


def register_middleware(app: FastAPI):

    @app.middleware("http")
    async def custom_logging(request: Request, call_next):

        start_time = time.time()

        response = await call_next(request)
        processing_time = time.time() - start_time

        message = f"{request.client.host}:{request.client.port} - {request.method} - {request.url.path} - {response.status_code} completed after {processing_time}s"

        print(message)

        return response

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # "http://localhost:3000"
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "localhost",
            "127.0.0.1",
            "server-health.azurewebsites.net",
            "0.0.0.0",
        ],
    )

    @app.middleware("http")
    async def error_logging_middleware(request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            with open("error.log", "a") as error_file:
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                error_message = f"[{timestamp}] Error: {str(e)} - Path: {request.url.path} - Method: {request.method}\n"
                error_file.write(error_message)
            raise
