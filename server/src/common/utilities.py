import random
import string
from fastapi import status
from datetime import datetime, timedelta
from calendar import monthrange

from src.common.enums import PaymentFrequencyEnum


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
    freq = frequency.lower()
    if freq == PaymentFrequencyEnum.daily.value:
        return current_date + timedelta(days=1)
    elif freq == PaymentFrequencyEnum.weekly.value:
        return current_date + timedelta(weeks=1)
    elif freq == PaymentFrequencyEnum.biweekly.value:
        return current_date + timedelta(weeks=2)
    elif freq == PaymentFrequencyEnum.monthly.value:
        month = current_date.month
        year = current_date.year
        if month == 12:
            next_month = 1
            next_year = year + 1
        else:
            next_month = month + 1
            next_year = year
        try:
            return current_date.replace(year=next_year, month=next_month)
        except ValueError:
            last_day = monthrange(next_year, next_month)[1]
            return current_date.replace(year=next_year, month=next_month, day=last_day)
    elif freq == PaymentFrequencyEnum.yearly.value:
        try:
            return current_date.replace(year=current_date.year + 1)
        except ValueError:
            # Handle Feb 29 on non-leap years
            return current_date.replace(year=current_date.year + 1, day=28)
    else:
        raise ValueError(
            "Frequency must be one of: daily, weekly, bi-weekly, monthly, yearly"
        )
