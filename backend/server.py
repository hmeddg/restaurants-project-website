"""Vercel entrypoint: Vercel needs a module-level ASGI `app`, not a factory."""

from app.main import create_app

app = create_app()
