import datetime as dt
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase

from app.clock import Clock, get_clock
from app.config import Settings, get_settings
from app.database import get_db
from app.schemas.reservation import (
    MAX_GUESTS,
    AvailabilityOut,
    ReservationIn,
    ReservationOut,
)
from app.services import availability
from app.services import reservations as service

router = APIRouter(prefix="/reservations", tags=["reservations"])


@router.get("/availability")
async def get_availability(
    date: Annotated[dt.date, Query()],
    guests: Annotated[int, Query(ge=1, le=MAX_GUESTS)],
    db: Annotated[AsyncDatabase, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
    clock: Annotated[Clock, Depends(get_clock)],
) -> AvailabilityOut:
    slots = await availability.get_slots(db, settings, date, guests, clock())
    return AvailabilityOut(date=date, guests=guests, slots=slots)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_reservation(
    reservation: ReservationIn,
    db: Annotated[AsyncDatabase, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
    clock: Annotated[Clock, Depends(get_clock)],
) -> ReservationOut:
    try:
        return await service.create_reservation(db, settings, reservation, clock())
    except service.SlotUnavailableError as error:
        raise HTTPException(
            status.HTTP_409_CONFLICT, {"code": "slot_unavailable"}
        ) from error
