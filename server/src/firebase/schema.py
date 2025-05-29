from typing import Optional

from pydantic import BaseModel


class IDVerificationResponse(BaseModel):
    is_valid: Optional[bool]
    uid: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    error: Optional[str] = None
