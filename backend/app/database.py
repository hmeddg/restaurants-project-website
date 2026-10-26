from fastapi import Request
from pymongo import ASCENDING, DESCENDING
from pymongo.asynchronous.database import AsyncDatabase


async def ensure_indexes(db: AsyncDatabase) -> None:
    await db.menu_items.create_index([("category", ASCENDING), ("sort", ASCENDING)])
    await db.slot_bookings.create_index(
        [("date", ASCENDING), ("time", ASCENDING)], unique=True
    )
    await db.reservations.create_index("code", unique=True)
    await db.reservations.create_index([("date", ASCENDING), ("time", ASCENDING)])
    await db.orders.create_index("number", unique=True)
    await db.orders.create_index([("created_at", DESCENDING)])
    await db.contact_messages.create_index([("created_at", DESCENDING)])


def get_db(request: Request) -> AsyncDatabase:
    return request.app.state.db
