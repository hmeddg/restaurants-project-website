from typing import Annotated

from fastapi import APIRouter, Depends, status
from pymongo.asynchronous.database import AsyncDatabase

from app.clock import Clock, get_clock
from app.database import get_db
from app.repositories import contact as repo
from app.schemas.contact import ContactMessageIn, ContactMessageOut

router = APIRouter(prefix="/contact-messages", tags=["contact"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_contact_message(
    message: ContactMessageIn,
    db: Annotated[AsyncDatabase, Depends(get_db)],
    clock: Annotated[Clock, Depends(get_clock)],
) -> ContactMessageOut:
    return await repo.insert_message(db, message, clock())
