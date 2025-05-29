from pydantic import BaseModel
from pydantic import constr

class BaseResponseModel(BaseModel):
    status: bool = True
    code: int = 200
    message: str = "success"
    data: dict | None = None
    error: dict | None = None
