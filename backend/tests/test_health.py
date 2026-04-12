# Coderun backend health endpoint testleri — /health yanıtı ve production OpenAPI davranışı.

import os
from unittest.mock import patch

import pytest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient


def _build_app(environment: str = "development") -> FastAPI:
    """Verilen ortam değişkeniyle izole bir FastAPI uygulaması oluşturur.

    Args:
        environment: Simüle edilecek ortam adı (development / production).

    Returns:
        FastAPI: Yapılandırılmış uygulama örneği.
    """
    is_prod = environment == "production"
    docs_url: str | None = None if is_prod else "/docs"
    redoc_url: str | None = None if is_prod else "/redoc"
    openapi_url: str | None = None if is_prod else "/openapi.json"

    test_app = FastAPI(
        title="Coderun",
        version="0.1.0",
        docs_url=docs_url,
        redoc_url=redoc_url,
        openapi_url=openapi_url,
    )
    test_app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health router'ı settings mock'u ile yükle
    env_vars = {
        "DATABASE_URL": "postgresql+asyncpg://test:test@localhost/test",
        "REDIS_URL": "redis://localhost:6379",
        "SECRET_KEY": "test-secret-key",
        "ENVIRONMENT": environment,
    }
    with patch.dict(os.environ, env_vars):
        # Modülü yeniden yüklemeden settings'i patch'le

        import backend.app.core.config as config_module
        import backend.app.api.v1.endpoints.health as health_module

        # settings nesnesini geçici olarak değiştir
        original_settings = config_module.settings

        class _MockSettings:
            ENVIRONMENT = environment
            APP_TITLE = "Coderun"
            APP_VERSION = "0.1.0"
            ALLOWED_ORIGINS = ["http://localhost:3000"]

            @property
            def is_production(self) -> bool:
                return self.ENVIRONMENT == "production"

        mock_settings = _MockSettings()
        config_module.settings = mock_settings  # type: ignore[assignment]
        health_module.settings = mock_settings  # type: ignore[assignment]

        test_app.include_router(health_module.router)

        # Restore
        config_module.settings = original_settings
        health_module.settings = original_settings

    return test_app


@pytest.fixture()
def _env_vars(monkeypatch: pytest.MonkeyPatch) -> None:
    """Gerekli ortam değişkenlerini test için ayarlar."""
    monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key")
    monkeypatch.setenv("ENVIRONMENT", "development")


class TestHealthEndpoint:
    """GET /health endpoint testleri."""

    def test_health_returns_200(self) -> None:
        """Health endpoint 200 döndürmeli."""
        app = _build_app("development")
        client = TestClient(app)
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_has_status_and_environment(self) -> None:
        """Health endpoint doğru JSON anahtarlarını döndürmeli."""
        app = _build_app("development")
        client = TestClient(app)
        data = client.get("/health").json()
        assert "status" in data
        assert "environment" in data

    def test_health_status_is_ok(self) -> None:
        """Health endpoint status değeri 'ok' olmalı."""
        app = _build_app("development")
        client = TestClient(app)
        data = client.get("/health").json()
        assert data["status"] == "ok"

    def test_health_returns_correct_environment(self) -> None:
        """Health endpoint environment değerini settings'ten okumalı."""
        import backend.app.core.config as config_module
        import backend.app.api.v1.endpoints.health as health_module

        original = config_module.settings

        class _Mock:
            ENVIRONMENT = "staging"

        mock = _Mock()
        config_module.settings = mock  # type: ignore[assignment]
        health_module.settings = mock  # type: ignore[assignment]

        try:
            test_app = FastAPI()
            test_app.include_router(health_module.router)
            client = TestClient(test_app)
            data = client.get("/health").json()
            assert data["environment"] == "staging"
        finally:
            config_module.settings = original
            health_module.settings = original


class TestProductionOpenAPI:
    """Production ortamında OpenAPI endpoint davranış testleri."""

    def test_openapi_disabled_in_production(self) -> None:
        """Production'da /openapi.json 404 döndürmeli."""
        app = _build_app("production")
        client = TestClient(app)
        assert client.get("/openapi.json").status_code == 404

    def test_docs_disabled_in_production(self) -> None:
        """Production'da /docs 404 döndürmeli."""
        app = _build_app("production")
        client = TestClient(app)
        assert client.get("/docs").status_code == 404

    def test_redoc_disabled_in_production(self) -> None:
        """Production'da /redoc 404 döndürmeli."""
        app = _build_app("production")
        client = TestClient(app)
        assert client.get("/redoc").status_code == 404

    def test_docs_enabled_in_development(self) -> None:
        """Development'da /docs 200 döndürmeli."""
        app = _build_app("development")
        client = TestClient(app)
        assert client.get("/docs").status_code == 200
