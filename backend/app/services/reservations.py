import datetime as dt
import secrets

from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.config import Settings
from app.repositories import reservations as repo
from app.schemas.reservation import ReservationIn, ReservationOut
from app.services.availability import is_bookable

CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
CODE_ATTEMPTS = 5


class SlotUnavailableError(Exception):
    """The requested time is in the past, outside the window or fully booked."""


def new_code() -> str:
    return "EL-" + "".join(secrets.choice(CODE_ALPHABET) for _ in range(6))


async def create_reservation(
    db: AsyncDatabase, settings: Settings, data: ReservationIn, now: dt.datetime
) -> ReservationOut:
    if not is_bookable(settings, data.date, data.time, now):
        raise SlotUnavailableError
    if not await repo.hold_seats(
        db, data.date, data.time, data.guests, settings.slot_capacity
    ):
        raise SlotUnavailableError

    try:
        for _ in range(CODE_ATTEMPTS):
            code = new_code()
            document = data.model_dump() | {
                "date": data.date.isoformat(),
                "code": code,
                "status": "confirmed",
                "created_at": now,
            }
            try:
                reservation_id = await repo.insert_reservation(db, document)
            except DuplicateKeyError as error:
                if repo.is_duplicate_code(error):
                    continue
                raise
            return ReservationOut(
                id=reservation_id,
                code=code,
                status="confirmed",
                date=data.date,
                time=data.time,
                guests=data.guests,
                name=data.name,
                occasion=data.occasion,
                created_at=now,
            )
        raise RuntimeError("Could not generate a unique reservation code")
    except BaseException:
        await repo.release_seats(db, data.date, data.time, data.guests)
        raise
