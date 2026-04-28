# Coderun backend FastAPI uygulama giriş noktası — middleware, router ve lifespan yapılandırması.

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.redis import close_redis, init_redis
from app.core.scheduler import start_scheduler, stop_scheduler
from app.core.seed import seed_database

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

    # Scheduler başlat (haftalık liderboard reset)
    start_scheduler()

    yield

    # Shutdown
    stop_scheduler()
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


def _configure_cors(application: FastAPI, allow_origins: list[str]) -> None:
    """CORS middleware'i yapılandırır.

    Güvenlik: allow_origins=["*"] ile allow_credentials=True birlikte kullanılamaz.
    Production'da ALLOWED_ORIGINS'e gerçek domain'ler girilmeli.

    Args:
        application: FastAPI uygulama örneği.
        allow_origins: İzin verilen origin listesi.
    """
    if "*" in allow_origins:
        application.add_middleware(
            CORSMiddleware,
            allow_origin_regex=r"http://localhost:\d+",
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=allow_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


_configure_cors(app, settings.ALLOWED_ORIGINS)

# ---------------------------------------------------------------------------
# Router'lar
# ---------------------------------------------------------------------------

app.include_router(health_router)
app.include_router(api_router, prefix="/api/v1")
