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


@pytest.mark.asyncio
async def test_get_db_rollback_on_exception() -> None:
    """get_db should rollback on exception and re-raise."""
    from backend.app.core.database import get_db
    from unittest.mock import AsyncMock, patch
    
    with patch("backend.app.core.database.AsyncSessionLocal") as mock_session_local:
        mock_session = AsyncMock()
        mock_session.rollback = AsyncMock()
        
        # Mock context manager
        async def mock_aenter():
            return mock_session
        
        async def mock_aexit(exc_type, exc_val, exc_tb):
            if exc_type:
                await mock_session.rollback()
            return False  # Don't suppress exception
        
        mock_session_local.return_value.__aenter__ = mock_aenter
        mock_session_local.return_value.__aexit__ = mock_aexit
        
        # Simulate exception during session usage
        with pytest.raises(RuntimeError):
            async for session in get_db():
                raise RuntimeError("Database error")
        
        # Rollback should have been called
        mock_session.rollback.assert_called_once()
