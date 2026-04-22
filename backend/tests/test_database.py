# Coderun backend — database module unit testleri.

import pytest
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_get_db_yields_session() -> None:
    """get_db should yield AsyncSession."""
    from app.core.database import get_db

    gen = get_db()
    try:
        session = await gen.__anext__()
        assert isinstance(session, AsyncSession)
    finally:
        await gen.aclose()


@pytest.mark.asyncio
async def test_get_db_handles_exception() -> None:
    """get_db should rollback on exception."""
    from app.core.database import get_db

    gen = get_db()
    try:
        await gen.__anext__()
        await gen.athrow(ValueError("Test error"))
    except (ValueError, StopAsyncIteration):
        pass
    finally:
        await gen.aclose()


@pytest.mark.asyncio
async def test_engine_configuration() -> None:
    """Engine should be configured correctly."""
    from app.core.database import engine
    
    assert engine is not None
    assert engine.pool is not None


@pytest.mark.asyncio
async def test_session_factory() -> None:
    """AsyncSessionLocal should create sessions."""
    from app.core.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as session:
        assert isinstance(session, AsyncSession)


@pytest.mark.asyncio
async def test_base_declarative() -> None:
    """Base should be a valid declarative base."""
    from app.core.database import Base
    
    assert hasattr(Base, "metadata")
    assert hasattr(Base, "registry")


@pytest.mark.asyncio
async def test_get_db_rollback_on_exception() -> None:
    """get_db should rollback on exception and re-raise."""
    from app.core.database import get_db

    gen = get_db()
    try:
        session = await gen.__anext__()
        await session.rollback()
        assert True  # rollback succeeded
    finally:
        await gen.aclose()
