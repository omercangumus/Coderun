# Coderun backend health endpoint — GET /health ile uygulama durumunu döndürür.

import logging

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.v1.dependencies import get_db, get_redis
from backend.app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis: Redis | None = Depends(get_redis),
) -> dict[str, str]:
    """Uygulamanın sağlık durumunu döndürür.

    Database ve Redis durumunu kontrol eder.

    Returns:
        dict[str, str]: ``status``, ``environment``, ``database`` ve ``redis`` anahtarlarını içeren sözlük.
    """
    # Database check
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        logger.error("Database health check failed: %s", exc)
        db_status = "error"

    # Redis check
    redis_status = "ok"
    if redis:
        try:
            ping_result = redis.ping()
            if hasattr(ping_result, '__await__'):
                await ping_result
        except Exception as exc:
            logger.error("Redis health check failed: %s", exc)
            redis_status = "error"
    else:
        redis_status = "disabled"

    overall_status = "ok" if db_status == "ok" else "degraded"

    return {
        "status": overall_status,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "redis": redis_status,
    }

