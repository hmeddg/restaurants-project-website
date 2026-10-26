from functools import lru_cache
from pathlib import Path
from zoneinfo import ZoneInfo

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env", env_file_encoding="utf-8", extra="ignore"
    )

    mongodb_uri: str = Field(min_length=1, description="Set MONGODB_URI in backend/.env")
    mongodb_db: str = "elever"
    api_key: str | None = None
    # Interactive docs at /docs; turn off in production.
    docs_enabled: bool = True

    timezone: str = "America/New_York"
    # Guests (not tables) that can be seated per time slot.
    slot_capacity: int = Field(default=20, ge=1)
    booking_window_days: int = Field(default=60, ge=1)
    order_prep_minutes: int = Field(default=25, ge=1)

    @property
    def tz(self) -> ZoneInfo:
        return ZoneInfo(self.timezone)


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]  # values come from the environment
