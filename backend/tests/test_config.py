# Coderun backend yapılandırma testleri — Settings sınıfı davranış doğrulaması.

import os

import pytest


class TestIsProductionProperty:
    """Settings.is_production property testleri."""

    def test_is_production_returns_true_for_production(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """ENVIRONMENT=production için is_production True döndürmeli.

        Args:
            monkeypatch: pytest monkeypatch fixture'ı.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@localhost/db")
        monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
        monkeypatch.setenv("SECRET_KEY", "test-secret")
        monkeypatch.setenv("ENVIRONMENT", "production")

        import importlib
        import backend.app.core.config as config_module

        importlib.reload(config_module)
        assert config_module.settings.is_production is True

    def test_is_production_returns_false_for_development(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """ENVIRONMENT=development için is_production False döndürmeli.

        Args:
            monkeypatch: pytest monkeypatch fixture'ı.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@localhost/db")
        monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
        monkeypatch.setenv("SECRET_KEY", "test-secret")
        monkeypatch.setenv("ENVIRONMENT", "development")

        import importlib
        import backend.app.core.config as config_module

        importlib.reload(config_module)
        assert config_module.settings.is_production is False


class TestSettingsDefaults:
    """Settings sınıfı varsayılan değer testleri."""

    def test_algorithm_default_is_hs256(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """ALGORITHM varsayılan değeri 'HS256' olmalı.

        Args:
            monkeypatch: pytest monkeypatch fixture'ı.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@localhost/db")
        monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
        monkeypatch.setenv("SECRET_KEY", "test-secret")
        monkeypatch.delenv("ALGORITHM", raising=False)

        import importlib
        import backend.app.core.config as config_module

        importlib.reload(config_module)
        assert config_module.settings.ALGORITHM == "HS256"

    def test_access_token_expire_minutes_default_is_30(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """ACCESS_TOKEN_EXPIRE_MINUTES varsayılan değeri 30 olmalı.

        Args:
            monkeypatch: pytest monkeypatch fixture'ı.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@localhost/db")
        monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
        monkeypatch.setenv("SECRET_KEY", "test-secret")
        monkeypatch.delenv("ACCESS_TOKEN_EXPIRE_MINUTES", raising=False)

        import importlib
        import backend.app.core.config as config_module

        importlib.reload(config_module)
        assert config_module.settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30

    def test_refresh_token_expire_days_default_is_7(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """REFRESH_TOKEN_EXPIRE_DAYS varsayılan değeri 7 olmalı.

        Args:
            monkeypatch: pytest monkeypatch fixture'ı.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@localhost/db")
        monkeypatch.setenv("REDIS_URL", "redis://localhost:6379")
        monkeypatch.setenv("SECRET_KEY", "test-secret")
        monkeypatch.delenv("REFRESH_TOKEN_EXPIRE_DAYS", raising=False)

        import importlib
        import backend.app.core.config as config_module

        importlib.reload(config_module)
        assert config_module.settings.REFRESH_TOKEN_EXPIRE_DAYS == 7
