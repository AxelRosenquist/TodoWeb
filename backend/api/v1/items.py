from uuid import UUID

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from api.response import api_response
from api.helper.tools import format_item_tasks, get_db_item
from database.database import get_db
from database.models.items import Items
from schemas.items_schema import ItemsCreate, ItemsUpdate

router = APIRouter(prefix="/api/v1/items", tags=["items"])


@router.post("")
def add_new_item(item: ItemsCreate, 
                 db: Session = Depends(get_db)):
    stmt = (select(Items).where(Items.title == item.title.lower()))
    existing = db.execute(stmt).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Item with the title {item.title} already exists.")
    new_item = Items(title=item.title.lower(),
                     description=item.description,
                     is_completed=item.is_completed)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return api_response(status_code=status.HTTP_201_CREATED,
                        data=new_item)


@router.get("/all-items")
def get_all_items(db: Session = Depends(get_db)):
    data = get_db_item(Items, db)
    return api_response(data=data)


@router.get("/all-items-with-tasks")
def get_all_items_with_tasks(db: Session = Depends(get_db)):
    stmt = select(Items).options(selectinload(Items.tasks))
    result = db.execute(stmt)
    items = result.scalars()
    return api_response(data=format_item_tasks(items))


@router.patch("/complete-item/{item_id}")
def complete_item(item_id: UUID, db: Session = Depends(get_db)):
    stmt = select(Items).where(Items.id == item_id).options(selectinload(Items.tasks))
    result = db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Item wit id {item_id} was not found")
    if item.tasks:
        for task in item.tasks:
            task.is_completed = True
    item.is_completed = True
    db.commit()
    return api_response(data=format_item_tasks(item))
    

@router.patch("/update/{item_id}")
def update_item(item_id: UUID,
                updata_values: ItemsUpdate,
                db: Session = Depends(get_db)):
    stmt = select(Items).where(Items.id == item_id)
    item = db.execute(stmt).scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Item with id {item_id} was not found")
    if updata_values.title: item.title = updata_values.title.lower() 
    if updata_values.description: item.description = updata_values.description
    
    db.commit()
    db.refresh(item)
    return api_response(data=item)


@router.delete("/delete/{item_id}")
def delete_item(item_id: UUID,
                db: Session = Depends(get_db)):
    stmt = select(Items).where(Items.id == item_id)
    item = db.execute(stmt).scalar_one_or_none()
    if item:
        try:
            db.delete(item)
        except Exception as e:
            raise HTTPException(detail=e)