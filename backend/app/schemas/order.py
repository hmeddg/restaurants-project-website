from datetime import datetime
from typing import Literal

from pydantic import EmailStr, Field, field_validator

from app.schemas.common import ApiModel, Name, Phone


class OrderItemIn(ApiModel):
    menu_item_id: str = Field(min_length=1, max_length=64)
    quantity: int = Field(ge=1, le=20)


class OrderIn(ApiModel):
    items: list[OrderItemIn] = Field(min_length=1, max_length=30)
    name: Name
    phone: Phone
    email: EmailStr | None = Field(default=None, max_length=254)
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("items")
    @classmethod
    def unique_items(cls, items: list[OrderItemIn]) -> list[OrderItemIn]:
        ids = [item.menu_item_id for item in items]
        if len(ids) != len(set(ids)):
            raise ValueError("Each menu item may appear only once")
        return items


class OrderLineOut(ApiModel):
    menu_item_id: str
    name: str
    quantity: int
    unit_price_cents: int
    line_total_cents: int


class OrderOut(ApiModel):
    id: str
    number: int
    status: Literal["received"]
    items: list[OrderLineOut]
    total_cents: int
    name: str
    ready_at: datetime
    created_at: datetime
