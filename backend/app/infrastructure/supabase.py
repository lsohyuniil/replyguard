from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


class SupabaseConfigurationError(RuntimeError):
    """Raised when the backend does not have Supabase credentials."""


@lru_cache
def get_supabase_client() -> Client:
    settings = get_settings()
    if not settings.supabase_configured:
        raise SupabaseConfigurationError("Supabase is not configured")

    assert settings.supabase_url is not None
    assert settings.supabase_service_role_key is not None
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key.get_secret_value(),
    )


def check_database_connection(client: Client) -> None:
    client.table("operators").select("id").limit(1).execute()

