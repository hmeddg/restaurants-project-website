from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.clock import Clock, get_clock
from app.config import Settings, get_settings
from app.database import get_db
from app.schemas.order import OrderIn, OrderOut
from app.services import orders as service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderIn,
    db: Annotated[AsyncDatabase, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
    clock: Annotated[Clock, Depends(get_clock)],
) -> OrderOut:
    try:
        return await service.place_order(db, settings, order, clock())
    except service.UnknownMenuItemsError as error:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            {"code": "unknown_items", "items": error.item_ids},
        ) from error
