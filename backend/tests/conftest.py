import datetime as dt
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.clock import get_clock
from app.config import get_settings
from app.main import create_app
from tests.fake_mongo import FakeClient, FakeDatabase

API_KEY = "test-key"
# 11:00 in New York on Monday 26 October 2026.
NOW = dt.datetime(2026, 10, 26, 15, 0, tzinfo=dt.UTC)


class Clock:
    def __init__(self) -> None:
        self.now = NOW

    def __call__(self) -> dt.datetime:
        return self.now


@pytest.fixture
def clock() -> Clock:
    return Clock()


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, clock: Clock) -> Iterator[TestClient]:
    monkeypatch.setenv("MONGODB_URI", "mongodb://unused")
    monkeypatch.setenv("MONGODB_DB", "elever_test")
    monkeypatch.setenv("API_KEY", API_KEY)
    monkeypatch.setenv("SLOT_CAPACITY", "20")
    get_settings.cache_clear()

    app = create_app(client_factory=FakeClient)
    app.dependency_overrides[get_clock] = lambda: clock
    with TestClient(app, headers={"x-api-key": API_KEY}) as test_client:
        yield test_client
    get_settings.cache_clear()


@pytest.fixture
def db(client: TestClient) -> FakeDatabase:
    return client.app.state.db  # type: ignore[attr-defined]
