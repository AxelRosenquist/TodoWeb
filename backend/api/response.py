from typing import Any
from fastapi import status


def api_response(
        data: Any = None,
        status_code: int = status.HTTP_200_OK,
        message: str = "",
):
    return {
        "data":data,
        "statusCode":status_code,
        "message":message,
    }
