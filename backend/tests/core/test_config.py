from pathlib import Path

from app.core.config import Settings


def test_settings_load_runtime_values_from_environment(monkeypatch) -> None:
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("FRONTEND_ORIGIN", "https://replyguard.example.com")
    monkeypatch.setenv("SUPABASE_URL", "https://replyguard.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")

    settings = Settings(_env_file=None)

    assert settings.app_env == "test"
    assert settings.frontend_origin == "https://replyguard.example.com"
    assert settings.supabase_url == "https://replyguard.supabase.co"
    assert settings.supabase_service_role_key is not None
    assert settings.supabase_service_role_key.get_secret_value() == (
        "test-service-role-key"
    )
    assert settings.supabase_configured is True


def test_settings_allow_server_start_without_supabase_credentials(
    monkeypatch,
) -> None:
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False)

    settings = Settings(_env_file=None)

    assert settings.supabase_configured is False


def test_settings_use_backend_env_file_by_default() -> None:
    expected_path = Path(__file__).resolve().parents[2] / ".env"

    assert Settings.model_config["env_file"] == expected_path
