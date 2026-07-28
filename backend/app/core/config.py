from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ReplyGuard API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    frontend_origin: str = "http://localhost:3000"
    supabase_url: str | None = None
    supabase_service_role_key: SecretStr | None = None

    @property
    def supabase_configured(self) -> bool:
        return bool(
            self.supabase_url
            and self.supabase_url.strip()
            and self.supabase_service_role_key
            and self.supabase_service_role_key.get_secret_value().strip()
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
