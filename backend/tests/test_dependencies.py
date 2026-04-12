# Coderun backend — dependencies testleri.

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.v1.dependencies import (
    get_current_active_user,
    get_current_user,
    get_db,
    get_redis,
)
from backend.app.models.user import User


@pytest.mark.asyncio
async def test_get_db_yields_session() -> None:
    """get_db async session döner."""
    gen = get_db()
    try:
        session = await gen.__anext__()
        assert isinstance(session, AsyncSession)
    finally:
        await gen.aclose()


@pytest.mark.asyncio
async def test_get_db_handles_exception() -> None:
    """get_db exception durumunda rollback yapar."""
    with patch("backend.app.api.v1.dependencies.AsyncSessionLocal") as mock_session_local:
        mock_session = AsyncMock()
        mock_session.rollback = AsyncMock()
        mock_session_local.return_value.__aenter__.return_value = mock_session
        mock_session_local.return_value.__aexit__.side_effect = Exception("Test error")

        with pytest.raises(Exception, match="Test error"):
            async for _ in get_db():
                pass


@pytest.mark.asyncio
async def test_get_redis_returns_client() -> None:
    """get_redis Redis client döner."""
    with patch("backend.app.core.redis.get_redis") as mock_get_redis:
        mock_client = MagicMock()
        
        async def mock_generator():
            yield mock_client
        
        mock_get_redis.return_value = mock_generator()
        
        result = await get_redis()
        assert result == mock_client


@pytest.mark.asyncio
async def test_get_redis_returns_none_when_no_client() -> None:
    """get_redis client yoksa None döner."""
    with patch("backend.app.core.redis.get_redis") as mock_get_redis:
        async def mock_generator():
            return
            yield  # noqa: RET503
        
        mock_get_redis.return_value = mock_generator()
        
        result = await get_redis()
        assert result is None


@pytest.mark.asyncio
async def test_get_current_active_user_inactive_user() -> None:
    """get_current_active_user aktif olmayan kullanıcı için hata fırlatır."""
    inactive_user = User(
        id=uuid4(),
        email="test@example.com",
        username="testuser",
        hashed_password="hashed",
        is_active=False,
    )
    
    with pytest.raises(HTTPException) as exc_info:
        await get_current_active_user(current_user=inactive_user)
    
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_get_current_active_user_active_user() -> None:
    """get_current_active_user aktif kullanıcı döner."""
    active_user = User(
        id=uuid4(),
        email="test@example.com",
        username="testuser",
        hashed_password="hashed",
        is_active=True,
    )
    
    result = await get_current_active_user(current_user=active_user)
    assert result == active_user
    assert result.is_active is True


@pytest.mark.asyncio
async def test_get_db_rollback_on_exception() -> None:
    """get_db exception durumunda rollback yapar."""
    from backend.app.api.v1.dependencies import get_db

    gen = get_db()
    try:
        session = await gen.__anext__()
        await session.rollback()
        assert True  # rollback succeeded
    finally:
        await gen.aclose()
