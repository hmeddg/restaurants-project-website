import datetime as dt

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import create_app
from tests.conftest import Clock
from tests.fake_mongo import FakeClient, FakeDatabase

GUEST = {"name": "Jane Cooper", "phone": "+1 (212) 555-0100", "email": "jane@example.com"}


def test_health_is_public(client: TestClient) -> None:
    response = client.get("/health", headers={"x-api-key": ""})
    assert response.json() == {"status": "ok"}


def test_rejects_requests_without_the_api_key(client: TestClient) -> None:
    response = client.get("/menu-items?category=salad", headers={"x-api-key": "nope"})
    assert response.status_code == 401


def test_menu_is_seeded_in_design_order(client: TestClient) -> None:
    response = client.get("/menu-items", params={"category": "salad"})

    assert response.status_code == 200
    items = response.json()
    assert [item["name"] for item in items] == [
        "Caesar Salad",
        "Mediterranean Bliss",
        "Greek Salad",
    ]
    assert items[1] == {
        "id": "mediterranean-bliss-salad",
        "category": "salad",
        "name": "Mediterranean Bliss",
        "description": "Quinoa, cherry tomatoes, avocado, feta and pomegranate.",
        "priceCents": 1299,
        "image": "/images/menu/mediterranean-bliss-salad.webp",
        "chefsPick": True,
    }


def test_contact_message_is_stored(client: TestClient, db: FakeDatabase) -> None:
    response = client.post(
        "/contact-messages",
        json={**GUEST, "subject": "Private dining", "message": "A table for twelve?"},
    )

    assert response.status_code == 201
    stored = db.sync.contact_messages.find_one()
    assert stored["email"] == "jane@example.com"
    assert stored["subject"] == "Private dining"
    assert stored["status"] == "new"


def test_contact_message_is_validated(client: TestClient) -> None:
    response = client.post(
        "/contact-messages",
        json={**GUEST, "email": "not-an-email", "subject": "Hi", "message": "short"},
    )
    assert response.status_code == 422


def test_all_evening_slots_are_open_in_the_morning(client: TestClient) -> None:
    response = client.get(
        "/reservations/availability", params={"date": "2026-10-26", "guests": 2}
    )

    slots = response.json()["slots"]
    assert [slot["time"] for slot in slots][:2] == ["17:30", "18:00"]
    assert all(slot["available"] for slot in slots)


def test_slots_close_thirty_minutes_before_seating(
    client: TestClient, clock: Clock
) -> None:
    clock.now = dt.datetime(2026, 10, 27, 0, 45, tzinfo=dt.UTC)  # 20:45 in New York

    response = client.get(
        "/reservations/availability", params={"date": "2026-10-26", "guests": 2}
    )

    open_times = [s["time"] for s in response.json()["slots"] if s["available"]]
    assert open_times == ["21:30"]


def test_reservation_is_stored_with_a_code(client: TestClient, db: FakeDatabase) -> None:
    response = client.post(
        "/reservations",
        json={**GUEST, "date": "2026-10-31", "time": "19:00", "guests": 2,
              "occasion": "Birthday"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["code"].startswith("EL-") and len(body["code"]) == 9
    assert body["status"] == "confirmed"
    stored = db.sync.reservations.find_one({"code": body["code"]})
    assert stored["date"] == "2026-10-31"
    assert stored["occasion"] == "Birthday"
    slot = db.sync.slot_bookings.find_one({"date": "2026-10-31", "time": "19:00"})
    assert slot["guests_booked"] == 2


def test_full_slot_is_rejected_and_shown_unavailable(client: TestClient) -> None:
    booking = {**GUEST, "date": "2026-10-31", "time": "19:00"}
    for guests in (7, 7, 6):
        assert client.post("/reservations", json={**booking, "guests": guests}).status_code == 201

    response = client.post("/reservations", json={**booking, "guests": 1})
    assert response.status_code == 409
    assert response.json()["detail"] == {"code": "slot_unavailable"}

    slots = client.get(
        "/reservations/availability", params={"date": "2026-10-31", "guests": 1}
    ).json()["slots"]
    assert {s["time"]: s["available"] for s in slots}["19:00"] is False


def test_reservation_time_must_be_a_listed_slot(client: TestClient) -> None:
    booking = {**GUEST, "date": "2026-10-31", "time": "10:00", "guests": 2}
    assert client.post("/reservations", json=booking).status_code == 422


def test_past_dates_and_large_parties_are_rejected(client: TestClient) -> None:
    past = {**GUEST, "date": "2026-10-20", "time": "19:00", "guests": 2}
    assert client.post("/reservations", json=past).status_code == 409

    large = {**GUEST, "date": "2026-10-31", "time": "19:00", "guests": 8}
    assert client.post("/reservations", json=large).status_code == 422


def test_order_prices_come_from_the_database(client: TestClient, db: FakeDatabase) -> None:
    response = client.post(
        "/orders",
        json={
            "name": "Jane Cooper",
            "phone": "+1 (212) 555-0100",
            "items": [
                {"menuItemId": "caesar-salad", "quantity": 2},
                {"menuItemId": "ribeye-steak", "quantity": 1},
            ],
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["number"] == 1001
    assert body["totalCents"] == 2 * 899 + 2899
    assert body["items"][0]["lineTotalCents"] == 1798
    # Placed at 11:00 on a Monday; the kitchen opens at 17:00.
    assert body["readyAt"] == "2026-10-26T21:25:00Z"
    assert db.sync.orders.count_documents({}) == 1

    second = client.post(
        "/orders",
        json={**GUEST, "items": [{"menuItemId": "iced-latte", "quantity": 1}]},
    )
    assert second.json()["number"] == 1002


def test_order_rejects_unknown_and_duplicate_items(client: TestClient) -> None:
    unknown = client.post(
        "/orders", json={**GUEST, "items": [{"menuItemId": "lobster", "quantity": 1}]}
    )
    assert unknown.status_code == 422
    assert unknown.json()["detail"] == {"code": "unknown_items", "items": ["lobster"]}

    duplicate = client.post(
        "/orders",
        json={
            **GUEST,
            "items": [
                {"menuItemId": "iced-latte", "quantity": 1},
                {"menuItemId": "iced-latte", "quantity": 2},
            ],
        },
    )
    assert duplicate.status_code == 422


def test_docs_can_be_turned_off(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MONGODB_URI", "mongodb://unused")
    monkeypatch.setenv("DOCS_ENABLED", "false")
    get_settings.cache_clear()
    try:
        app = create_app(client_factory=FakeClient)
        with TestClient(app) as test_client:
            assert test_client.get("/docs").status_code == 404
            assert test_client.get("/openapi.json").status_code == 404
    finally:
        get_settings.cache_clear()
