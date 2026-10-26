"""Initial menu, taken from the Figma design. Inserted only when an item is missing,
so prices or descriptions edited directly in MongoDB are never overwritten."""

from pymongo.asynchronous.database import AsyncDatabase

MENU_ITEMS: list[dict] = [
    {
        "_id": "caesar-salad",
        "category": "salad",
        "name": "Caesar Salad",
        "description": "Crisp romaine, shaved parmesan, garlic croutons, classic dressing.",
        "price_cents": 899,
        "chefs_pick": False,
    },
    {
        "_id": "mediterranean-bliss-salad",
        "category": "salad",
        "name": "Mediterranean Bliss",
        "description": "Quinoa, cherry tomatoes, avocado, feta and pomegranate.",
        "price_cents": 1299,
        "chefs_pick": True,
    },
    {
        "_id": "greek-salad",
        "category": "salad",
        "name": "Greek Salad",
        "description": "Tomato, cucumber, red onion, kalamata olives and feta.",
        "price_cents": 1099,
        "chefs_pick": False,
    },
    {
        "_id": "ribeye-steak",
        "category": "steak",
        "name": "Ribeye Steak",
        "description": "12 oz ribeye with herb butter, roasted garlic and sea salt.",
        "price_cents": 2899,
        "chefs_pick": False,
    },
    {
        "_id": "filet-mignon",
        "category": "steak",
        "name": "Filet Mignon",
        "description": "8 oz tenderloin with red wine jus and buttered greens.",
        "price_cents": 3499,
        "chefs_pick": True,
    },
    {
        "_id": "new-york-strip-steak",
        "category": "steak",
        "name": "New York Strip",
        "description": "10 oz strip loin with peppercorn sauce and rosemary.",
        "price_cents": 2699,
        "chefs_pick": False,
    },
    {
        "_id": "spaghetti-carbonara",
        "category": "pasta",
        "name": "Spaghetti Carbonara",
        "description": "Guanciale, egg yolk, pecorino and cracked black pepper.",
        "price_cents": 1699,
        "chefs_pick": False,
    },
    {
        "_id": "fettuccine-alfredo",
        "category": "pasta",
        "name": "Fettuccine Alfredo",
        "description": "Fresh fettuccine in a silky butter and parmesan sauce.",
        "price_cents": 1599,
        "chefs_pick": True,
    },
    {
        "_id": "penne-arrabbiata",
        "category": "pasta",
        "name": "Penne Arrabbiata",
        "description": "Spicy tomato sauce with garlic, chili and fresh basil.",
        "price_cents": 1499,
        "chefs_pick": False,
    },
    {
        "_id": "fresh-lemonade",
        "category": "drinks",
        "name": "Fresh Lemonade",
        "description": "Pressed lemons, cane sugar, fresh mint and sparkling water.",
        "price_cents": 599,
        "chefs_pick": False,
    },
    {
        "_id": "virgin-mojito",
        "category": "drinks",
        "name": "Virgin Mojito",
        "description": "Lime, fresh mint, soda and crushed ice. Alcohol-free.",
        "price_cents": 799,
        "chefs_pick": True,
    },
    {
        "_id": "iced-latte",
        "category": "drinks",
        "name": "Iced Latte",
        "description": "Double espresso and cold milk poured over ice.",
        "price_cents": 499,
        "chefs_pick": False,
    },
]


async def seed_menu(db: AsyncDatabase) -> None:
    for sort, item in enumerate(MENU_ITEMS):
        item_id = item["_id"]
        document = {key: value for key, value in item.items() if key != "_id"}
        document |= {
            "image": f"/images/menu/{item_id}.webp",
            "sort": sort,
            "available": True,
        }
        await db.menu_items.update_one(
            {"_id": item_id}, {"$setOnInsert": document}, upsert=True
        )
