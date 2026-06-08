import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Settings(BaseModel):
    DB_HOST: str = os.getenv("DATABASE_HOST")
    DB_NAME: str = os.getenv("DATABASE_NAME")
    DB_PORT: str = os.getenv("DATABASE_PORT")
    DB_USERNAME: str = os.getenv("DATABASE_USER")
    DB_PASSWORD: str = os.getenv("DATABASE_PASSWORD")

    CORS_IP: str = os.getenv("CORS_ORIGIN_IP")

    CORS_ORIGINS: list[str] = [f"http://{CORS_IP}:5173", f"https://{CORS_IP}:5173"]

    CONN_STRING: str = f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

settings = Settings()