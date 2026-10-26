from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pymongo.asynchronous.database import AsyncDatabase

from app.database import get_db
from app.repositories import menu as repo
from app.schemas.menu import MenuCategory, MenuItemOut

router = APIRouter(prefix="/menu-items", tags=["menu"])


@router.get("")
async def list_menu_items(
    category: Annotated[MenuCategory, Query()],
    db: Annotated[AsyncDatabase, Depends(get_db)],
) -> list[MenuItemOut]:
    return await repo.list_by_category(db, category)
