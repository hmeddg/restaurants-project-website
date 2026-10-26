import datetime as dt

from pymongo.asynchronous.database import AsyncDatabase

from app.config import Settings
from app.repositories import menu as menu_repo
from app.repositories import orders as repo
from app.schemas.order import OrderIn, OrderLineOut, OrderOut
from app.services.opening_hours import next_pickup_time


class UnknownMenuItemsError(Exception):
    def __init__(self, item_ids: list[str]) -> None:
        super().__init__(f"Unknown or unavailable menu items: {', '.join(item_ids)}")
        self.item_ids = item_ids


async def place_order(
    db: AsyncDatabase, settings: Settings, data: OrderIn, now: dt.datetime
) -> OrderOut:
    requested = [item.menu_item_id for item in data.items]
    menu = await menu_repo.find_available(db, requested)
    missing = [item_id for item_id in requested if item_id not in menu]
    if missing:
        raise UnknownMenuItemsError(missing)

    # Prices always come from the database, never from the client.
    lines = [
        OrderLineOut(
            menu_item_id=item.menu_item_id,
            name=menu[item.menu_item_id]["name"],
            quantity=item.quantity,
            unit_price_cents=menu[item.menu_item_id]["price_cents"],
            line_total_cents=menu[item.menu_item_id]["price_cents"] * item.quantity,
        )
        for item in data.items
    ]
    total = sum(line.line_total_cents for line in lines)
    ready_at = next_pickup_time(now, settings).astimezone(dt.UTC)
    number = await repo.next_order_number(db)

    document = {
        "number": number,
        "status": "received",
        "items": [line.model_dump() for line in lines],
        "total_cents": total,
        "name": data.name,
        "phone": data.phone,
        "email": data.email,
        "notes": data.notes,
        "ready_at": ready_at,
        "created_at": now,
    }
    order_id = await repo.insert_order(db, document)
    return OrderOut(
        id=order_id,
        number=number,
        status="received",
        items=lines,
        total_cents=total,
        name=data.name,
        ready_at=ready_at,
        created_at=now,
    )
