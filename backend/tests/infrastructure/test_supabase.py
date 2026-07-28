import pytest

from app.core.config import Settings, get_settings
from app.infrastructure import supabase
from app.infrastructure.supabase import (
    SupabaseConfigurationError,
    get_supabase_client,
)


@pytest.fixture(autouse=True)
def clear_settings_and_client_caches():
    get_settings.cache_clear()
    get_supabase_client.cache_clear()
    yield
    get_settings.cache_clear()
    get_supabase_client.cache_clear()


def test_supabase_client_is_reused_within_process(monkeypatch) -> None:
    monkeypatch.setenv("SUPABASE_URL", "https://replyguard.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")

    first = get_supabase_client()
    second = get_supabase_client()

    assert first is second


def test_supabase_client_requires_url_and_backend_key(monkeypatch) -> None:
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False)
    monkeypatch.setattr(
        supabase,
        "get_settings",
        lambda: Settings(_env_file=None),
    )

    with pytest.raises(SupabaseConfigurationError, match="Supabase is not configured"):
        get_supabase_client()
