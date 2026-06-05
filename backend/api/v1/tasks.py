from uuid import UUID

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from api.response import api_response
from api.helper.tools import get_item
from database.database import get_db
from database.models.tasks import Tasks


router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.get("/all-tasks")
def get_all_tasks(db: Session = Depends(get_db)):
    data = get_item(Tasks, db)
    return api_response(data=data)
