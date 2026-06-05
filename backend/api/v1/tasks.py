from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID

from api.response import api_response
from api.helper.tools import get_db_item
from database.database import get_db
from database.models.tasks import Tasks
from schemas.tasks_schema import TasksCreate, TasksUpdate


router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.post("")
def add_new_task(task: TasksCreate, 
                 db: Session = Depends(get_db)):
    stmt = (select(Tasks).where(Tasks.item_id == task.item_id).where(Tasks.title == task.title.lower()))
    existing = db.execute(stmt).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Task with the title {task.title} already exists for that Item.")
    new_task = Tasks(title=task.title.lower(),
                     item_id=task.item_id,
                     is_completed=task.is_completed)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return api_response(status_code=status.HTTP_201_CREATED,
                        data=new_task)


@router.get("/all-tasks")
def get_all_tasks(db: Session = Depends(get_db)):
    data = get_db_item(Tasks, db)
    return api_response(data=data)


@router.patch("/complete-task/{task_id}")
def complete_task(task_id: UUID, db: Session = Depends(get_db)):
    stmt = select(Tasks).where(Tasks.id == task_id)
    result = db.execute(stmt)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id {task_id} was not found")
    task.is_completed = True
    db.commit()
    db.refresh(task)
    return api_response(data=task)
    

@router.patch("/update/{task_id}")
def update_task(task_id: UUID,
                updata_values: TasksUpdate,
                db: Session = Depends(get_db)):
    stmt = select(Tasks).where(Tasks.id == task_id)
    task = db.execute(stmt).scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id {task_id} was not found")
    if updata_values.title: task.title = updata_values.title.lower() 
    
    db.commit()
    db.refresh(task)
    return api_response(data=task)


@router.delete("/delete/{task_id}")
def delete_task(task_id: UUID,
                db: Session = Depends(get_db)):
    stmt = select(Tasks).where(Tasks.id == task_id)
    task = db.execute(stmt).scalar_one_or_none()
    if task:
        try:
            db.delete(task)
        except Exception as e:
            raise HTTPException(detail=e)