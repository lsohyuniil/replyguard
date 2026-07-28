from fastapi.testclient import TestClient

from app.api.dependencies import provide_supabase_client
from app.core.config import Settings
from app.main import create_app


def test_health_returns_application_status() -> None:
    client = TestClient(create_app(Settings()))

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_cors_uses_configured_frontend_origin() -> None:
    client = TestClient(
        create_app(Settings(frontend_origin="https://admin.example.com")),
    )

    response = client.options(
        "/health",
        headers={
            "Origin": "https://admin.example.com",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == (
        "https://admin.example.com"
    )


class FakeSupabaseQuery:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error

    def table(self, name: str):
        assert name == "operators"
        return self

    def select(self, columns: str):
        assert columns == "id"
        return self

    def limit(self, count: int):
        assert count == 1
        return self

    def execute(self):
        if self.error is not None:
            raise self.error
        return object()


def test_database_health_returns_ok_after_successful_query() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_supabase_client] = (
        lambda: FakeSupabaseQuery()
    )

    response = TestClient(application).get("/health/database")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_database_health_hides_connection_error_details() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_supabase_client] = (
        lambda: FakeSupabaseQuery(RuntimeError("service-role-secret"))
    )

    response = TestClient(application).get("/health/database")

    assert response.status_code == 503
    assert response.json() == {"detail": "database unavailable"}
    assert "service-role-secret" not in response.text
