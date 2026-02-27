from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/davirezende"
    ENVIRONMENT: str = "development"
    BACKEND_API_ROOT_PATH: str = ""
    ARTICLES_STORAGE_PATH: Optional[str] = None  # default: backend/storage/articles

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
