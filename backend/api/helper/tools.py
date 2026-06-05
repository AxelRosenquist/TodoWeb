from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID

from database.models.items import Items


def get_db_item(item: object, db: Session):
    stmt = select(item)
    result = db.execute(stmt)
    return result.scalars().all()


def format_item_tasks(items: Items):
    return {
        "items": [
            {
                "id": str(item.id),
                "title": item.title,
                "description": item.description,
                "is_completed": item.is_completed,
                "created_at": item.created_at,
                "tasks": [
                    {
                        "id": str(task.id),
                        "item_id": str(task.item_id),
                        "title": task.title,
                        "is_completed": task.is_completed,
                        "created_at": task.created_at
                    }
                    for task in item.tasks
                ]

            }
            for item in items
        ]
    }