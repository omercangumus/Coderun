# Coderun backend — APScheduler ile haftalık liderboard reset otomasyonu.

import logging
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)

_scheduler: AsyncIOScheduler | None = None


async def _reset_weekly_leaderboard_job() -> None:
    """Haftalık liderboard'u sıfırlayan scheduled job."""
    from app.core.redis import get_redis
    from app.services.leaderboard_service import reset_weekly_leaderboard

    logger.info("Haftalık liderboard reset job başlatıldı: %s", datetime.now(timezone.utc))
    
    async for redis in get_redis():
        await reset_weekly_leaderboard(redis)
        break


def start_scheduler() -> None:
    """APScheduler'ı başlatır ve haftalık reset job'ını ekler.
    
    Her pazartesi 00:00 UTC'de çalışır.
    """
    global _scheduler
    
    if _scheduler is not None:
        logger.warning("Scheduler zaten çalışıyor.")
        return
    
    _scheduler = AsyncIOScheduler(timezone="UTC")
    
    # Her pazartesi 00:00 UTC'de çalış
    _scheduler.add_job(
        _reset_weekly_leaderboard_job,
        trigger=CronTrigger(day_of_week="mon", hour=0, minute=0),
        id="weekly_leaderboard_reset",
        name="Haftalık Liderboard Reset",
        replace_existing=True,
    )
    
    _scheduler.start()
    logger.info("Scheduler başlatıldı: Haftalık liderboard reset job eklendi.")


def stop_scheduler() -> None:
    """APScheduler'ı durdurur."""
    global _scheduler
    
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        logger.info("Scheduler durduruldu.")
