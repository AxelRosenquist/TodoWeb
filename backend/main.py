from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


from api.response import api_response
from database.database import Base, engine, get_db 
from config import settings


app = FastAPI(title="Shelfy")

Base.metadata.create_all(bind=engine)


print(settings.CORS_ORIGINS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        content=api_response(
            data=None,
            message=str(exc.detail),
            status_code=exc.status_code,
        ),
        status_code=exc.status_code,
    )


@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        content=api_response(
            data=None,
            message="Internal Server Error",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        ),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        content=api_response(
            data=None,
            message="Validation Error",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        ),
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )


@app.get('/')
async def root():
    return api_response(
        data="Hello World!"
    )