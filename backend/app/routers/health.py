from typing import Annotated

from fastapi import APIRouter, Depends
from pymongo.asynchronous.database import AsyncDatabase

from app.database import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
async def health(db: Annotated[AsyncDatabase, Depends(get_db)]) -> dict[str, str]:
    await db.command("ping")
    return {"status": "ok"}
