import asyncio
import datetime as dt
from typing import Any

from pymongo.errors import DuplicateKeyError

from app.repositories.reservations import hold_seats
from tests.fake_mongo import FakeClient, FakeCollection

DATE = dt.date(2026, 10, 31)


class RacingCollection(FakeCollection):
    """Another request creates the slot just before our upsert lands."""

    def __init__(self, inner: FakeCollection, already_booked: int) -> None:
        super().__init__(inner.sync)
        self.already_booked = already_booked
        self.raced = False

    async def update_one(self, *args: Any, upsert: bool = False, **kwargs: Any) -> Any:
        if upsert and not self.raced:
            self.raced = True
            self.sync.insert_one(
                {"date": DATE.isoformat(), "time": "19:00", "guests_booked": self.already_booked}
            )
            raise DuplicateKeyError("E11000 duplicate key error")
        return self.sync.update_one(*args, upsert=upsert, **kwargs)


def make_slots(already_booked: int) -> RacingCollection:
    db = FakeClient()["race"]
    db.sync.slot_bookings.create_index([("date", 1), ("time", 1)], unique=True)
    return RacingCollection(db.slot_bookings, already_booked)


class Db:
    def __init__(self, slots: RacingCollection) -> None:
        self.slot_bookings = slots


def test_concurrent_first_booking_still_gets_seats() -> None:
    slots = make_slots(already_booked=2)

    held = asyncio.run(hold_seats(Db(slots), DATE, "19:00", guests=3, capacity=20))  # type: ignore[arg-type]

    assert held is True
    assert slots.sync.find_one()["guests_booked"] == 5


def test_concurrent_booking_that_fills_the_slot_is_refused() -> None:
    slots = make_slots(already_booked=19)

    held = asyncio.run(hold_seats(Db(slots), DATE, "19:00", guests=3, capacity=20))  # type: ignore[arg-type]

    assert held is False
    assert slots.sync.find_one()["guests_booked"] == 19
