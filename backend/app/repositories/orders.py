from pymongo import ReturnDocument
from pymongo.asynchronous.database import AsyncDatabase

FIRST_ORDER_NUMBER = 1001


async def next_order_number(db: AsyncDatabase) -> int:
    counter = await db.counters.find_one_and_update(
        {"_id": "orders"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return FIRST_ORDER_NUMBER + counter["seq"] - 1


async def insert_order(db: AsyncDatabase, document: dict) -> str:
    result = await db.orders.insert_one(document)
    return str(result.inserted_id)
