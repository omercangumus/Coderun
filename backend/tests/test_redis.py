# Coderun backend — Redis module unit testleri.

import pytest
from unittest.mock import AsyncMock, patch


@pytest.mark.asyncio
async def test_init_redis_success() -> None:
    """init_redis should initialize Redis client successfully."""
    from backend.app.core import redis as redis_module
    
    with patch("backend.app.core.redis.aioredis.from_url") as mock_from_url:
        mock_client = AsyncMock()
        mock_client.ping = AsyncMock(return_value=True)
        mock_from_url.return_value = mock_client
        
        await redis_module.init_redis()
        
        assert redis_module._redis_client is not None
        mock_client.ping.assert_called_once()


@pytest.mark.asyncio
async def test_init_redis_connection_error() -> None:
    """init_redis should handle connection errors gracefully."""
    from backend.app.core import redis as redis_module
    
    with patch("backend.app.core.redis.aioredis.from_url") as mock_from_url:
        mock_from_url.side_effect = Exception("Connection failed")
        
        # Should not raise exception
        await redis_module.init_redis()
        
        # Client should be None
        assert redis_module._redis_client is None


@pytest.mark.asyncio
async def test_close_redis() -> None:
    """close_redis should close Redis connection."""
    from backend.app.core import redis as redis_module
    
    # Set up a mock client
    mock_client = AsyncMock()
    mock_client.aclose = AsyncMock()
    redis_module._redis_client = mock_client
    
    await redis_module.close_redis()
    
    mock_client.aclose.assert_called_once()
    assert redis_module._redis_client is None


@pytest.mark.asyncio
async def test_close_redis_when_none() -> None:
    """close_redis should handle None client gracefully."""
    from backend.app.core import redis as redis_module
    
    redis_module._redis_client = None
    
    # Should not raise exception
    await redis_module.close_redis()


@pytest.mark.asyncio
async def test_get_redis_yields_client() -> None:
    """get_redis should yield Redis client."""
    from backend.app.core import redis as redis_module
    
    mock_client = AsyncMock()
    redis_module._redis_client = mock_client
    
    async for client in redis_module.get_redis():
        assert client == mock_client
        break


@pytest.mark.asyncio
async def test_get_redis_yields_none() -> None:
    """get_redis should yield None when client is not initialized."""
    from backend.app.core import redis as redis_module
    
    redis_module._redis_client = None
    
    async for client in redis_module.get_redis():
        assert client is None
        break
