from typing import Literal

from app.schemas.common import ApiModel

MenuCategory = Literal["salad", "steak", "pasta", "drinks"]


class MenuItemOut(ApiModel):
    id: str
    category: MenuCategory
    name: str
    description: str
    price_cents: int
    image: str
    chefs_pick: bool
