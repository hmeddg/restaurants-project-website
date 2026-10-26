import datetime as dt

import pytest

from app.config import Settings
from app.services.opening_hours import next_pickup_time

NEW_YORK = dt.timezone(dt.timedelta(hours=-4))  # EDT, late October 2026


@pytest.fixture
def settings() -> Settings:
    return Settings(mongodb_uri="mongodb://unused", order_prep_minutes=25)


@pytest.mark.parametrize(
    ("placed", "ready"),
    [
        # Monday morning: cooked once the kitchen opens at 17:00.
        ((2026, 10, 26, 11, 0), (2026, 10, 26, 17, 25)),
        # Monday evening service: 19:27 rounds up to the next five minutes.
        ((2026, 10, 26, 19, 2), (2026, 10, 26, 19, 30)),
        # Too close to Monday's 23:00 close: ready when Tuesday opens.
        ((2026, 10, 26, 22, 50), (2026, 10, 27, 17, 25)),
        # Saturday closes at midnight; Sunday opens at 16:00.
        ((2026, 10, 31, 23, 40), (2026, 11, 1, 16, 25)),
    ],
)
def test_next_pickup_time(
    settings: Settings, placed: tuple[int, ...], ready: tuple[int, ...]
) -> None:
    now = dt.datetime(*placed, tzinfo=NEW_YORK)

    result = next_pickup_time(now, settings)

    expected = dt.datetime(*ready, tzinfo=settings.tz)
    assert result == expected
