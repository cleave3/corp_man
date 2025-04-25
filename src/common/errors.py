from typing import Any, Callable
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status
from sqlalchemy.exc import SQLAlchemyError


class CreditActionAppException(Exception):
    """This is the base class for all credit_action_app errors"""

    pass


class PasswordAlreadySet(CreditActionAppException):
    """User has already set a password"""

    pass

class InvalidToken(CreditActionAppException):
    """User has provided an invalid or expired token"""

    pass


class RevokedToken(CreditActionAppException):
    """User has provided a token that has been revoked"""

    pass


class AccessTokenRequired(CreditActionAppException):
    """User has provided a refresh token when an access token is needed"""

    pass


class RefreshTokenRequired(CreditActionAppException):
    """User has provided an access token when a refresh token is needed"""

    pass


class UserAlreadyExists(CreditActionAppException):
    """User has provided an email for a user who exists during sign up."""

    pass


class InvalidCredentials(CreditActionAppException):
    """User has provided wrong email or password during log in."""

    pass


class InsufficientPermission(CreditActionAppException):
    """User does not have the neccessary permissions to perform an action."""

    pass

class UserNotFound(CreditActionAppException):
    """User Not found"""

    pass


class UserAlreadyVerified(CreditActionAppException):
    """User Already Verified"""

    pass

class AccountNotVerified(Exception):
    """Account not yet verified"""

    pass

class RecommendationGenerationFailed(Exception):
    """Failed to generate recommendation"""

    pass


class InternalServerError(Exception):
    """Internal Server Error"""

    pass


def create_exception_handler(
    status_code: int, initial_detail: Any
) -> Callable[[Request, Exception], JSONResponse]:

    async def exception_handler(request: Request, exc: CreditActionAppException):

        return JSONResponse(content=initial_detail, status_code=status_code)

    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "status": False,
                "code": status.HTTP_403_FORBIDDEN,
                "message": "User with email already exists",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "status": False,
                "code": status.HTTP_404_NOT_FOUND,
                "message": "User not found",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "status": False,
                "code": status.HTTP_400_BAD_REQUEST,
                "message": "Invalid Email Or Password",
                "data": None,
            },
        ),
    )
    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "status": False,
                "code": status.HTTP_401_UNAUTHORIZED,
                "message": "Token is invalid Or expired",
                "data": None,
            },
        ),
    )
    app.add_exception_handler(
        RevokedToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "status": False,
                "code": status.HTTP_401_UNAUTHORIZED,
                "message": "Token is invalid or has been revoked",
                "data": None,
            },
        ),
    )
    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "status": False,
                "code": status.HTTP_401_UNAUTHORIZED,
                "message": "Please provide a valid access token",
                "data": None,
            },
        ),
    )
    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "status": False,
                "code": status.HTTP_403_FORBIDDEN,
                "message": "Please provide a valid refresh token",
                "data": None,
            },
        ),
    )
    app.add_exception_handler(
        InsufficientPermission,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "status": False,
                "code": status.HTTP_401_UNAUTHORIZED,
                "message": "You do not have enough permissions to perform this action",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        AccountNotVerified,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "status": False,
                "code": status.HTTP_403_FORBIDDEN,
                "message": "Account Not verified",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        UserAlreadyVerified,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            initial_detail={
                "status": False,
                "code": status.HTTP_409_CONFLICT,
                "message": "User already verified",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        PasswordAlreadySet,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            initial_detail={
                "status": False,
                "code": status.HTTP_409_CONFLICT,
                "message": "Password already set",
                "data": None,
            },
        ),
    )

    app.add_exception_handler(
        RecommendationGenerationFailed,
        create_exception_handler(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            initial_detail={
                "status": False,
                "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Error generating recommendations",
                "data": None,
            },
        ),
    )

    # @app.exception_handler(status.HTTP_500_INTERNAL_SERVER_ERROR)
    # async def internal_server_error(request, exc):

    #     return JSONResponse(
    #         content={
    #             "status": False,
    #             "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             "message": "Oops! Something went wrong",
    # "data": None,
    #
    #         },
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #     )

    # @app.exception_handler(SQLAlchemyError)
    # async def database__error(request, exc):
    #     print(str(exc))
    #     return JSONResponse(
    #         content={
    #             "status": False,
    #             "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             "message": "Oops! Something went wrong",
    # "data": None,
    #
    #         },
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #     )
