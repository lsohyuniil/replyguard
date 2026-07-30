from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.api.dependencies import provide_current_operator


def test_protected_route_rejects_missing_bearer_token() -> None:
    application = FastAPI()

    @application.get("/protected")
    def protected_route(
        _operator=Depends(provide_current_operator),
    ) -> dict[str, bool]:
        return {"ok": True}

    response = TestClient(application).get("/protected")

    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert response.json() == {"detail": "authentication required"}
