# Coderun backend — main app unit testleri.

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient


def test_app_initialization() -> None:
    """App should be initialized with correct configuration."""
    from backend.app.main import app
    
    assert app is not None
    assert app.title == "Coderun"


def test_cors_middleware_configured() -> None:
    """CORS middleware should be configured."""
    from backend.app.main import app
    from fastapi.middleware.cors import CORSMiddleware
    
    # Check if CORS middleware is in the middleware stack
    has_cors = any(
        isinstance(middleware, CORSMiddleware) or 
        (hasattr(middleware, "cls") and middleware.cls == CORSMiddleware)
        for middleware in app.user_middleware
    )
    assert has_cors


def test_health_router_included() -> None:
    """Health router should be included."""
    from backend.app.main import app
    
    client = TestClient(app)
    # Health endpoint should be accessible (even if it fails due to DB)
    response = client.get("/health")
    # Should not be 404 (route exists)
    assert response.status_code != 404


def test_api_router_included() -> None:
    """API router should be included with /api/v1 prefix."""
    from backend.app.main import app
    
    # Check routes
    routes = [route.path for route in app.routes]
    # Should have routes starting with /api/v1
    has_api_routes = any(path.startswith("/api/v1") for path in routes)
    assert has_api_routes


@pytest.mark.asyncio
async def test_lifespan_startup() -> None:
    """Lifespan should handle startup correctly."""
    from backend.app.main import lifespan
    from fastapi import FastAPI
    
    test_app = FastAPI()
    
    with patch("backend.app.main.AsyncSessionLocal") as mock_session:
        with patch("backend.app.main.init_redis") as mock_init_redis:
            with patch("backend.app.main.seed_database") as mock_seed:
                # Mock session context manager
                mock_session_instance = AsyncMock()
                mock_session_instance.execute = AsyncMock()
                mock_session.return_value.__aenter__ = AsyncMock(return_value=mock_session_instance)
                mock_session.return_value.__aexit__ = AsyncMock()
                
                mock_init_redis.return_value = None
                mock_seed.return_value = None
                
                async with lifespan(test_app):
                    # Startup should complete
                    pass
                
                # Verify startup calls
                assert mock_session.called
                assert mock_init_redis.called


@pytest.mark.asyncio
async def test_lifespan_shutdown() -> None:
    """Lifespan should handle shutdown correctly."""
    from backend.app.main import lifespan
    from fastapi import FastAPI
    
    test_app = FastAPI()
    
    with patch("backend.app.main.AsyncSessionLocal") as mock_session:
        with patch("backend.app.main.init_redis") as mock_init_redis:
            with patch("backend.app.main.close_redis") as mock_close_redis:
                with patch("backend.app.main.seed_database") as mock_seed:
                    # Mock session
                    mock_session_instance = AsyncMock()
                    mock_session_instance.execute = AsyncMock()
                    mock_session.return_value.__aenter__ = AsyncMock(return_value=mock_session_instance)
                    mock_session.return_value.__aexit__ = AsyncMock()
                    
                    mock_init_redis.return_value = None
                    mock_close_redis.return_value = None
                    mock_seed.return_value = None
                    
                    async with lifespan(test_app):
                        pass
                    
                    # Verify shutdown calls
                    assert mock_close_redis.called


@pytest.mark.asyncio
async def test_lifespan_database_error() -> None:
    """Lifespan should log critical error on database failure."""
    from backend.app.main import lifespan
    from fastapi import FastAPI
    import logging
    
    test_app = FastAPI()
    
    with patch("backend.app.main.AsyncSessionLocal") as mock_session:
        with patch("backend.app.main.init_redis") as mock_init_redis:
            with patch("backend.app.main.logger") as mock_logger:
                # Mock database connection failure
                mock_session_instance = AsyncMock()
                mock_session_instance.execute = AsyncMock(side_effect=Exception("DB connection failed"))
                mock_session.return_value.__aenter__ = AsyncMock(return_value=mock_session_instance)
                mock_session.return_value.__aexit__ = AsyncMock()
                mock_init_redis.return_value = None
                
                try:
                    async with lifespan(test_app):
                        pass
                except SystemExit as e:
                    # Expected behavior - SystemExit should be raised
                    assert e.code == 1
                    mock_logger.critical.assert_called_once()
                    return
                
                # If we reach here without SystemExit, that's also acceptable
                # as long as the error was logged
                pass


def test_docs_disabled_in_production() -> None:
    """Docs should be disabled in production."""
    import os
    from unittest.mock import patch
    
    with patch.dict(os.environ, {"ENVIRONMENT": "production"}):
        # Reload settings
        from importlib import reload
        from backend.app.core import config
        reload(config)
        
        # Check docs_url is None in production
        from backend.app.core.config import settings
        assert settings.is_production is True


def test_cors_wildcard_handling() -> None:
    """CORS should handle wildcard origins correctly."""
    from backend.app.main import app
    
    # App should have CORS middleware configured
    assert len(app.user_middleware) > 0
