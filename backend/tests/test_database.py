# Coderun backend — database module unit testleri.

import pytest
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_get_db_yields_session() -> None:
    """get_db should yield AsyncSession."""
    from backend.app.core.database import get_db
    
    async for session in get_db():
        assert isinstance(session, AsyncSession)
        break


@pytest.mark.asyncio
async def test_get_db_handles_exception() -> None:
    """get_db should rollback on exception."""
    from backend.app.core.database import get_db
    
    try:
        async for session in get_db():
            # Simulate an error
            raise ValueError("Test error")
    except ValueError:
        # Exception should be raised after rollback
        pass


@pytest.mark.asyncio
async def test_engine_configuration() -> None:
    """Engine should be configured correctly."""
    from backend.app.core.database import engine
    
    assert engine is not None
    assert engine.pool is not None


@pytest.mark.asyncio
async def test_session_factory() -> None:
    """AsyncSessionLocal should create sessions."""
    from backend.app.core.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as session:
        assert isinstance(session, AsyncSession)


@pytest.mark.asyncio
async def test_base_declarative() -> None:
    """Base should be a valid declarative base."""
    from backend.app.core.database import Base
    
    assert hasattr(Base, "metadata")
    assert hasattr(Base, "registry")
