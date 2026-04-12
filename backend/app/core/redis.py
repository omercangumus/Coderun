# Coderun backend — Redis bağlantı yönetimi; async Redis client ve dependency injection.

import logging
from collections.abc import AsyncGenerator

import redis.asyncio as aioredis
from redis.asyncio import Redis

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Global Redis client
# ---------------------------------------------------------------------------

_redis_client: Redis | None = None


async def init_redis() -> None:
    """Uygulama başlangıcında Redis bağlantısını başlatır.

    Bağlantı başarısız olursa hata loglanır ancak uygulama çalışmaya devam eder.
    """
    global _redis_client
    try:
        _redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
        await _redis_client.ping()  # type: ignore[misc]
        logger.info("Redis bağlantısı başarılı.")
    except Exception as exc:
        logger.warning("Redis bağlantısı kurulamadı: %s — liderboard devre dışı.", exc)
        _redis_client = None


async def close_redis() -> None:
    """Uygulama kapanırken Redis bağlantısını kapatır."""
    global _redis_client
    if _redis_client is not None:
        await _redis_client.aclose()
        _redis_client = None
        logger.info("Redis bağlantısı kapatıldı.")


async def get_redis() -> AsyncGenerator[Redis | None, None]:
    """FastAPI Depends() ile kullanılan Redis client sağlayıcısı.

    Redis bağlantısı yoksa None döner; çağıran kod None kontrolü yapmalıdır.

    Yields:
        Redis client ya da ``None``.
    """
    yield _redis_client
