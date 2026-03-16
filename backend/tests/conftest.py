# Coderun backend test altyapısı — paylaşılan fixture'lar ve pytest-asyncio yapılandırması.

from unittest.mock import AsyncMock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession


def pytest_configure(config: pytest.Config) -> None:
    """pytest-asyncio için asyncio_mode=auto yapılandırmasını ayarlar.

    Args:
        config: pytest yapılandırma nesnesi.
    """
    config.addinivalue_line("markers", "asyncio: mark test as async")
    config.option.__dict__.setdefault("asyncio_mode", "auto")


@pytest.fixture()
def mock_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    """Test ortamı için gerekli ortam değişkenlerini ayarlar.

    DATABASE_URL, REDIS_URL ve SECRET_KEY değişkenlerini monkeypatch
    ile test değerleriyle doldurur.

    Args:
        monkeypatch: pytest monkeypatch fixture'ı.
    """
    monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/testdb")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379/1")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-for-testing-only")
    monkeypatch.setenv("ENVIRONMENT", "development")


@pytest.fixture()
def async_session_mock() -> AsyncMock:
    """Mock AsyncSession fixture'ı döndürür.

    SQLAlchemy AsyncSession'ı AsyncMock ile taklit eder; gerçek
    veritabanı bağlantısı gerektirmeyen testlerde kullanılır.

    Returns:
        AsyncMock: AsyncSession spec'ine sahip mock nesne.
    """
    return AsyncMock(spec=AsyncSession)
