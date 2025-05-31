import random
import string
from fastapi import status
from datetime import datetime, timedelta
from calendar import monthrange


def generate_random_numbers(length):
    return "".join(random.choices(string.digits, k=length))


def response(
    status: bool = True,
    code: int = status.HTTP_200_OK,
    message: str = "sucess",
    data=None,
    error=None,
):
    return {
        "status": status,
        "code": code,
        "message": message,
        "data": data,
        "error": error,
    }


def calculate_next_payment_date(current_date: datetime, frequency: str) -> datetime:
    if frequency.lower() == "weekly":
        return current_date + timedelta(weeks=1)
    elif frequency.lower() == "monthly":
        # Add one month, handling month/year rollover
        month = current_date.month
        year = current_date.year
        # day = current_date.day

        if month == 12:
            next_month = 1
            next_year = year + 1
        else:
            next_month = month + 1
            next_year = year

        # Handle cases where the next month has fewer days
        try:
            return current_date.replace(year=next_year, month=next_month)
        except ValueError:
            # If day is not valid (e.g., Feb 30), use last day of next month
            last_day = monthrange(next_year, next_month)[1]
            return current_date.replace(year=next_year, month=next_month, day=last_day)
    else:
        raise ValueError("Frequency must be 'weekly' or 'monthly'")
