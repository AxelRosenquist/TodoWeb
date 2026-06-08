from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class TasksCreate(BaseModel):
    item_id: UUID
    title: str 
    description: Optional[str] = None 
    is_completed: bool = False


class TasksUpdate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None 