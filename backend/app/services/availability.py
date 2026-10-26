import datetime as dt

from pymongo.asynchronous.database import AsyncDatabase

from app.config import Settings
from app.repositories import reservations as repo
from app.schemas.reservation import SLOT_TIMES, SlotOut

# Online bookings close shortly before the seating starts.
BOOKING_LEAD = dt.timedelta(minutes=30)


def booking_window(settings: Settings, now: dt.datetime) -> tuple[dt.date, dt.date]:
    today = now.astimezone(settings.tz).date()
    return today, today + dt.timedelta(days=settings.booking_window_days)


def slot_start(settings: Settings, date: dt.date, time: str) -> dt.datetime:
    hour, minute = (int(part) for part in time.split(":"))
    return dt.datetime.combine(date, dt.time(hour, minute), tzinfo=settings.tz)


def is_bookable(settings: Settings, date: dt.date, time: str, now: dt.datetime) -> bool:
    first, last = booking_window(settings, now)
    if time not in SLOT_TIMES or not first <= date <= last:
        return False
    return slot_start(settings, date, time) > now + BOOKING_LEAD


async def get_slots(
    db: AsyncDatabase, settings: Settings, date: dt.date, guests: int, now: dt.datetime
) -> list[SlotOut]:
    booked = await repo.booked_guests_by_time(db, date)
    return [
        SlotOut(
            time=time,
            available=is_bookable(settings, date, time, now)
            and booked.get(time, 0) + guests <= settings.slot_capacity,
        )
        for time in SLOT_TIMES
    ]
