from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from pymongo import AsyncMongoClient

from app.config import get_settings
from app.database import ensure_indexes
from app.routers import contact, health, menu, orders, reservations
from app.security import require_api_key
from app.seed.menu import seed_menu

ClientFactory = Callable[[], AsyncMongoClient]


def default_client() -> AsyncMongoClient:
    settings = get_settings()
    return AsyncMongoClient(
        settings.mongodb_uri,
        tz_aware=True,
        serverSelectionTimeoutMS=5000,
        appname="elever-api",
    )


def create_app(client_factory: ClientFactory = default_client) -> FastAPI:
    """App factory: `uvicorn app.main:create_app --factory`."""
    settings = get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        client = client_factory()
        db = client[settings.mongodb_db]
        await ensure_indexes(db)
        await seed_menu(db)
        app.state.db = db
        try:
            yield
        finally:
            await client.close()

    docs = settings.docs_enabled
    app = FastAPI(
        title="elever API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs" if docs else None,
        redoc_url=None,
        openapi_url="/openapi.json" if docs else None,
    )
    app.include_router(health.router)

    protected = [Depends(require_api_key)]
    for module in (contact, menu, orders, reservations):
        app.include_router(module.router, dependencies=protected)
    return app
