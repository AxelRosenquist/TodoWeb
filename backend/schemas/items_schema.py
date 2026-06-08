from pydantic import BaseModel
from typing import Optional


class ItemsCreate(BaseModel):
    title: str 
    description: Optional[str] = None
    is_completed: bool = False


class ItemsUpdate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None