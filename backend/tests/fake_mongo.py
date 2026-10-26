"""Async facade over mongomock, covering the PyMongo async API the app uses."""

from typing import Any

import mongomock


class FakeCursor:
    def __init__(self, cursor: mongomock.collection.Cursor) -> None:
        self._cursor = cursor

    def sort(self, *args: Any, **kwargs: Any) -> "FakeCursor":
        self._cursor = self._cursor.sort(*args, **kwargs)
        return self

    async def to_list(self, length: int | None = None) -> list[dict]:
        documents = list(self._cursor)
        return documents if length is None else documents[:length]


class FakeCollection:
    def __init__(self, collection: mongomock.Collection) -> None:
        self.sync = collection

    def find(self, *args: Any, **kwargs: Any) -> FakeCursor:
        return FakeCursor(self.sync.find(*args, **kwargs))

    def __getattr__(self, name: str) -> Any:
        method = getattr(self.sync, name)

        async def call(*args: Any, **kwargs: Any) -> Any:
            return method(*args, **kwargs)

        return call


class FakeDatabase:
    def __init__(self, db: mongomock.Database) -> None:
        self.sync = db

    def __getitem__(self, name: str) -> FakeCollection:
        return FakeCollection(self.sync[name])

    def __getattr__(self, name: str) -> FakeCollection:
        return self[name]

    async def command(self, name: str) -> dict:
        return {"ok": 1.0}


class FakeClient:
    def __init__(self) -> None:
        self._client = mongomock.MongoClient(tz_aware=True)

    def __getitem__(self, name: str) -> FakeDatabase:
        return FakeDatabase(self._client[name])

    async def close(self) -> None:
        self._client.close()
