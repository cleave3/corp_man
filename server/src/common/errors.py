from typing import Callable
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status
from sqlalchemy.exc import SQLAlchemyError
from fastapi.exceptions import RequestValidationError


class CorpmanException(Exception):
    """This is the base class for all credit_action_app errors"""

    pass


class PasswordAlreadySet(CorpmanException):
    """User has already set a password"""

    pass


class InvalidToken(CorpmanException):
    """User has provided an invalid or expired token"""

    pass


class RevokedToken(CorpmanException):
    """User has provided a token that has been revoked"""

    pass


class AccessTokenRequired(CorpmanException):
    """User has provided a refresh token when an access token is needed"""

    pass


class RefreshTokenRequired(CorpmanException):
    """User has provided an access token when a refresh token is needed"""

    pass


class UserAlreadyExists(CorpmanException):
    """User has provided an email for a user who exists during sign up."""

    pass


class UserPhoneAlreadyExists(CorpmanException):
    """User has provided an phone for a user who exists during sign up."""

    pass


class InvalidCredentials(CorpmanException):
    """User has provided wrong email or password during log in."""

    pass


class InsufficientPermission(CorpmanException):
    """User does not have the neccessary permissions to perform an action."""

    pass


class UserNotFound(CorpmanException):
    """User Not found"""

    pass


class CustomerNotFound(CorpmanException):
    """Customer Not found"""

    pass


class TransactionNotFound(CorpmanException):
    """Transaction Not found"""

    pass


class UserSubscriptionNotFound(CorpmanException):
    """Customer Subscription Not found"""

    pass


class UserAlreadyVerified(CorpmanException):
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


class FreemiumException(Exception):
    """This is the base class for unsubscribed users errors"""

    pass


class AcceptTermsException(Exception):
    """This is the base class for when terms and condition is not yet accepted errors"""

    pass


class ActionNotAllowed(Exception):
    """Action not allowed"""

    pass


class InvalidPassword(CorpmanException):
    """User current password doesn't match."""

    pass


class AccountRestricted(CorpmanException):
    pass


class BadRequest(CorpmanException):
    pass


def create_exception_handler(
    status_code: int, message: str
) -> Callable[[Request, Exception], JSONResponse]:

    async def exception_handler(request: Request, exc: CorpmanException):

        error = str(exc)
        err_message = None

        is_validation_error = isinstance(exc, RequestValidationError)
        is_bad_request = isinstance(exc, BadRequest)
        validation_error = None

        if is_validation_error:
            # Extract the first error message from the validation errors
            if exc.errors():
                validation_error = exc.errors()[0].get("msg", message)

        if is_bad_request:
            error = message
            err_message = str(exc)

        return JSONResponse(
            content={
                "status": False,
                "code": status_code,
                "message": (
                    validation_error
                    if is_validation_error
                    else err_message if is_bad_request else message
                ),
                "data": None,
                "error": message if is_validation_error else error,
            },
            status_code=status_code,
        )

    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            message="email already exists",
        ),
    )
    app.add_exception_handler(
        UserPhoneAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            message="phone already exists",
        ),
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            message="User not found",
        ),
    )

    app.add_exception_handler(
        CustomerNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Customer not found",
        ),
    )

    app.add_exception_handler(
        TransactionNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Transaction not found",
        ),
    )

    app.add_exception_handler(
        UserSubscriptionNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            message="subscription not found",
        ),
    )

    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Invalid Email Or Password",
        ),
    )
    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Token is invalid Or expired",
        ),
    )
    app.add_exception_handler(
        RevokedToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Token is invalid or has been revoked",
        ),
    )
    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Please provide a valid access token",
        ),
    )
    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Please provide a valid refresh token",
        ),
    )
    app.add_exception_handler(
        InsufficientPermission,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="You do not have enough permissions to perform this action",
        ),
    )

    app.add_exception_handler(
        AccountNotVerified,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Account Not verified. Please verify you email to continue",
        ),
    )

    app.add_exception_handler(
        UserAlreadyVerified,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            message="User already verified",
        ),
    )

    app.add_exception_handler(
        PasswordAlreadySet,
        create_exception_handler(
            status_code=status.HTTP_409_CONFLICT,
            message="Password already set",
        ),
    )

    app.add_exception_handler(
        RecommendationGenerationFailed,
        create_exception_handler(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Error generating recommendations",
        ),
    )
    app.add_exception_handler(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        create_exception_handler(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Oops! Something went wrong [SERVER]",
        ),
    )
    app.add_exception_handler(
        SQLAlchemyError,
        create_exception_handler(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Oops! Something went wrong [DB]",
        ),
    )
    app.add_exception_handler(
        RequestValidationError,
        create_exception_handler(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="validation errors",
        ),
    )
    app.add_exception_handler(
        FreemiumException,
        create_exception_handler(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            message="Please upgrade to a premium plan to access this feature",
        ),
    )
    app.add_exception_handler(
        AcceptTermsException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Please accept terms of use before proceeding",
        ),
    )
    app.add_exception_handler(
        BadRequest,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Bad request",
        ),
    )
    app.add_exception_handler(
        InvalidPassword,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Your current password doesn't match",
        ),
    )
    app.add_exception_handler(
        ActionNotAllowed,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Action not allowed",
        ),
    )
    app.add_exception_handler(
        AccountRestricted,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Account has been restricted or blocked",
        ),
    )
