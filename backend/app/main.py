# Coderun backend FastAPI uygulama giriş noktası — middleware, router ve lifespan yapılandırması.

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from backend.app.api.v1.endpoints.health import router as health_router
from backend.app.api.v1.router import api_router
from backend.app.core.config import settings
from backend.app.core.database import AsyncSessionLocal
from backend.app.core.redis import close_redis, init_redis
from backend.app.core.seed import seed_database

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan context manager (on_event deprecated yerine)
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Uygulama başlangıç ve kapanış işlemlerini yönetir."""
    # Startup
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        logger.info("Veritabanı bağlantısı başarılı.")
        async with AsyncSessionLocal() as session:
            await seed_database(session)
    except Exception as exc:
        logger.critical("Veritabanı bağlantısı kurulamadı: %s", exc)
        raise SystemExit(1) from exc

    await init_redis()

    yield

    # Shutdown
    await close_redis()


# ---------------------------------------------------------------------------
# FastAPI örneği
# ---------------------------------------------------------------------------

_docs_url: str | None = None if settings.is_production else "/docs"
_redoc_url: str | None = None if settings.is_production else "/redoc"
_openapi_url: str | None = None if settings.is_production else "/openapi.json"

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    docs_url=_docs_url,
    redoc_url=_redoc_url,
    openapi_url=_openapi_url,
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

_allow_origins = settings.ALLOWED_ORIGINS
# allow_credentials=True is incompatible with allow_origins=["*"]
_has_wildcard = "*" in _allow_origins

if _has_wildcard:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"http://localhost:\d+",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ---------------------------------------------------------------------------
# Router'lar
# ---------------------------------------------------------------------------

app.include_router(health_router)
app.include_router(api_router, prefix="/api/v1")
