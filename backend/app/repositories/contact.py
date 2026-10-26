from datetime import datetime

from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.contact import ContactMessageIn, ContactMessageOut


async def insert_message(
    db: AsyncDatabase, message: ContactMessageIn, now: datetime
) -> ContactMessageOut:
    document = message.model_dump() | {"status": "new", "created_at": now}
    result = await db.contact_messages.insert_one(document)
    return ContactMessageOut(id=str(result.inserted_id), created_at=now)
