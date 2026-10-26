import datetime as dt

from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError


async def booked_guests_by_time(db: AsyncDatabase, date: dt.date) -> dict[str, int]:
    cursor = db.slot_bookings.find({"date": date.isoformat()})
    return {doc["time"]: doc["guests_booked"] for doc in await cursor.to_list()}


async def hold_seats(
    db: AsyncDatabase, date: dt.date, time: str, guests: int, capacity: int
) -> bool:
    """Atomically add guests to a slot if they fit; False when the slot is full.

    The filter only matches a slot with room left. When it doesn't match, the
    upsert tries to insert a second document for the same (date, time) and the
    unique index rejects it, so two requests can never overbook a slot.
    """
    with_room = {
        "date": date.isoformat(),
        "time": time,
        "guests_booked": {"$lte": capacity - guests},
    }
    add_guests = {"$inc": {"guests_booked": guests}}
    try:
        await db.slot_bookings.update_one(with_room, add_guests, upsert=True)
    except DuplicateKeyError:
        # Either the slot is full, or a concurrent request created it a moment
        # ago. Retrying without upsert tells the two apart.
        result = await db.slot_bookings.update_one(with_room, add_guests)
        return result.modified_count == 1
    return True


async def release_seats(db: AsyncDatabase, date: dt.date, time: str, guests: int) -> None:
    await db.slot_bookings.update_one(
        {"date": date.isoformat(), "time": time},
        {"$inc": {"guests_booked": -guests}},
    )


async def insert_reservation(db: AsyncDatabase, document: dict) -> str:
    result = await db.reservations.insert_one(document)
    return str(result.inserted_id)


def is_duplicate_code(error: DuplicateKeyError) -> bool:
    return "code" in (error.details or {}).get("keyPattern", {})
