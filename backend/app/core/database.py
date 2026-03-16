# Coderun backend veritabanı bağlantı katmanı — async SQLAlchemy engine, session factory ve bağımlılık enjeksiyonu.

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from backend.app.core.config import settings

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=not settings.is_production,
    pool_pre_ping=True,
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# ---------------------------------------------------------------------------
# Declarative base
# ---------------------------------------------------------------------------


class Base(DeclarativeBase):
    """Tüm ORM modellerinin türetileceği declarative base sınıfı."""


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI ``Depends()`` ile kullanılan async veritabanı oturumu sağlayıcısı.

    Her istek için yeni bir ``AsyncSession`` açar; istek tamamlandığında
    oturumu kapatır. Herhangi bir istisna durumunda otomatik olarak
    ``rollback`` uygular.

    Yields:
        AsyncSession: Aktif veritabanı oturumu.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
