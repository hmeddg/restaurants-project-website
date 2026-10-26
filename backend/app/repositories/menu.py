from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.menu import MenuItemOut


def to_menu_item(document: dict) -> MenuItemOut:
    return MenuItemOut(
        id=document["_id"],
        category=document["category"],
        name=document["name"],
        description=document["description"],
        price_cents=document["price_cents"],
        image=document["image"],
        chefs_pick=document.get("chefs_pick", False),
    )


async def list_by_category(db: AsyncDatabase, category: str) -> list[MenuItemOut]:
    cursor = db.menu_items.find({"category": category, "available": True}).sort("sort")
    return [to_menu_item(document) for document in await cursor.to_list()]


async def find_available(db: AsyncDatabase, item_ids: list[str]) -> dict[str, dict]:
    cursor = db.menu_items.find({"_id": {"$in": item_ids}, "available": True})
    return {document["_id"]: document for document in await cursor.to_list()}
