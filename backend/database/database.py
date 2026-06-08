from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config import settings

DB_URL = settings.CONN_STRING

if DB_URL is None:
    raise RuntimeError("No db connection string set")

engine = create_engine(
    DB_URL,
    echo=False
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()