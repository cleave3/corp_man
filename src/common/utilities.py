    
import random
import string
from fastapi import status

def generate_random_numbers(length):
        return "".join(random.choices(string.digits, k=length))
  
def response(status: bool = True, code: int = status.HTTP_200_OK, message: str = "sucess", data=None, error=None):
        return {"status": status, "code": code, "message": message, "data": data, "error": error}