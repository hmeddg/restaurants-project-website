import datetime as dt
import math

from app.config import Settings

# Keep in sync with `hours` in config/site.ts. Index 0 is Monday.
# A closing time of 24:00 is written as (24, 0).
OPENING_HOURS: tuple[tuple[tuple[int, int], tuple[int, int]], ...] = (
    ((17, 0), (23, 0)),
    ((17, 0), (23, 0)),
    ((17, 0), (23, 0)),
    ((17, 0), (23, 0)),
    ((17, 0), (24, 0)),
    ((17, 0), (24, 0)),
    ((16, 0), (22, 0)),
)


def _at(day: dt.date, hour: int, minute: int, settings: Settings) -> dt.datetime:
    midnight = dt.datetime.combine(day, dt.time(0, 0), tzinfo=settings.tz)
    return midnight + dt.timedelta(hours=hour, minutes=minute)


def _round_up(moment: dt.datetime, minutes: int = 5) -> dt.datetime:
    seconds = minutes * 60
    timestamp = math.ceil(moment.timestamp() / seconds) * seconds
    return dt.datetime.fromtimestamp(timestamp, tz=moment.tzinfo)


def next_pickup_time(now: dt.datetime, settings: Settings) -> dt.datetime:
    """Earliest time an order placed now can be collected.

    The kitchen only cooks while the restaurant is open, so an order placed
    before opening (or after closing) is ready shortly after the next opening.
    """
    prep = dt.timedelta(minutes=settings.order_prep_minutes)
    local_now = now.astimezone(settings.tz)

    for offset in range(8):
        day = local_now.date() + dt.timedelta(days=offset)
        (open_h, open_m), (close_h, close_m) = OPENING_HOURS[day.weekday()]
        opens = _at(day, open_h, open_m, settings)
        closes = _at(day, close_h, close_m, settings)
        ready = _round_up(max(local_now, opens) + prep)
        if ready <= closes:
            return ready
    raise RuntimeError("No opening hours configured")
