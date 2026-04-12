# Coderun backend test altyapısı — auth testleri için gerçek SQLite async test veritabanı ve istemci fixture'ları.

from __future__ import annotations

import os
from collections.abc import AsyncGenerator
from pathlib import Path
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./tests/test_auth.db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/1")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only-32ch")
os.environ.setdefault("ENVIRONMENT", "development")

from backend.app.api.v1.dependencies import get_db
from backend.app.core.database import Base
from backend.app.main import app
from backend.app import models as _models

TEST_DATABASE_URL = "sqlite+aiosqlite:///./tests/test_auth.db"
_ = _models
test_engine = create_async_engine(TEST_DATABASE_URL, future=True)
TestingSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


def pytest_configure(config: pytest.Config) -> None:
    """pytest-asyncio için asyncio_mode=auto yapılandırmasını ayarlar."""
    config.addinivalue_line("markers", "asyncio: mark test as async")
    config.option.__dict__.setdefault("asyncio_mode", "auto")


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database() -> AsyncGenerator[None, None]:
    """Test oturumu boyunca SQLite test veritabanını hazırlar."""
    db_path = Path("tests/test_auth.db")
    if db_path.exists():
        db_path.unlink()
    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    await test_engine.dispose()
    if db_path.exists():
        db_path.unlink()


@pytest_asyncio.fixture()
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Her test için temiz bir transaction alanı sağlar."""
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture()
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Dependency override edilmiş async test istemcisi döndürür."""

    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        """API için test veritabanı oturumu sağlar."""
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture()
async def test_user(client: AsyncClient) -> dict[str, str]:
    """Kayıtlı test kullanıcısı oluşturur ve kimlik bilgilerini döndürür."""
    unique_id = uuid4().hex[:8]
    payload = {
        "email": f"testuser_{unique_id}@example.com",
        "username": f"test_user_{unique_id}",
        "password": "StrongPass1",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    return payload
