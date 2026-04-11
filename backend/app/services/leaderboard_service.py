# Coderun backend — Redis liderboard servis katmanı; haftalık XP sıralaması.

import logging
from datetime import date, timedelta
from uuid import UUID

from redis.asyncio import Redis

from backend.app.core.config import settings
from backend.app.schemas.gamification import LeaderboardEntry, LeaderboardResponse

logger = logging.getLogger(__name__)


def _get_week_key() -> str:
    """Mevcut haftanın Redis key'ini döner.

    Format: leaderboard:weekly:{YYYY-WW}

    Returns:
        Haftalık liderboard Redis key'i.
    """
    today = date.today()
    year, week, _ = today.isocalendar()
    return f"leaderboard:weekly:{year}-{week:02d}"


def _get_week_bounds() -> tuple[date, date]:
    """Mevcut haftanın başlangıç ve bitiş tarihlerini döner.

    Returns:
        (week_start, week_end) tuple'ı (Pazartesi–Pazar).
    """
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    return week_start, week_end


async def add_xp_to_leaderboard(
    redis: Redis | None,
    user_id: UUID,
    username: str,
    xp_earned: int,
    level: int = 1,
    streak: int = 0,
) -> None:
    """Haftalık liderboard'a XP ekler.

    Redis down olsa bile hata fırlatmaz; sadece loglar.

    Args:
        redis: Redis client (None ise işlem atlanır).
        user_id: Kullanıcının UUID'si.
        username: Kullanıcı adı.
        xp_earned: Bu işlemde kazanılan XP.
        level: Kullanıcının mevcut seviyesi.
        streak: Kullanıcının mevcut streak değeri.
    """
    if redis is None:
        return

    try:
        week_key = _get_week_key()
        user_id_str = str(user_id)

        # Sorted set'e XP ekle
        await redis.zincrby(week_key, xp_earned, user_id_str)
        await redis.expire(week_key, settings.LEADERBOARD_TTL_SECONDS)

        # Kullanıcı bilgilerini hash'te sakla
        info_key = f"user:info:{user_id_str}"
        await redis.hset(info_key, mapping={
            "username": username,
            "level": str(level),
            "streak": str(streak),
        })
        await redis.expire(info_key, settings.LEADERBOARD_TTL_SECONDS)

    except Exception as exc:
        logger.warning("Liderboard güncellenemedi: %s", exc)


async def get_weekly_leaderboard(
    redis: Redis | None,
    user_id: UUID | None = None,
    limit: int = 10,
) -> LeaderboardResponse:
    """Haftalık liderboard'u getirir.

    Args:
        redis: Redis client (None ise boş yanıt döner).
        user_id: Giriş yapan kullanıcının UUID'si (sırasını bulmak için).
        limit: Döndürülecek maksimum kullanıcı sayısı.

    Returns:
        Sıralı liderboard yanıtı.
    """
    week_start, week_end = _get_week_bounds()
    empty_response = LeaderboardResponse(
        entries=[],
        total_count=0,
        user_rank=None,
        week_start=week_start,
        week_end=week_end,
    )

    if redis is None:
        return empty_response

    try:
        week_key = _get_week_key()
        capped_limit = min(limit, settings.LEADERBOARD_TOP_N)

        # En yüksek skordan sıralı getir (withscores=True)
        raw_entries = await redis.zrevrange(week_key, 0, capped_limit - 1, withscores=True)
        total_count = await redis.zcard(week_key)

        entries: list[LeaderboardEntry] = []
        for rank, entry in enumerate(raw_entries, start=1):
            # zrevrange withscores=True → (member, score) tuple listesi döner
            uid_str, score = entry
            info_key = f"user:info:{uid_str}"
            info = await redis.hgetall(info_key)
            entries.append(
                LeaderboardEntry(
                    rank=rank,
                    user_id=UUID(uid_str),
                    username=info.get("username", "Bilinmiyor"),
                    weekly_xp=int(float(score)),
                    level=int(info.get("level", 1)),
                    streak=int(info.get("streak", 0)),
                )
            )
        user_rank: int | None = None
        if user_id is not None:
            rank_result = await redis.zrevrank(week_key, str(user_id))
            if rank_result is not None:
                user_rank = int(rank_result) + 1  # 0-indexed → 1-indexed

        return LeaderboardResponse(
            entries=entries,
            total_count=int(total_count),
            user_rank=user_rank,
            week_start=week_start,
            week_end=week_end,
        )

    except Exception as exc:
        logger.warning("Liderboard alınamadı: %s", exc)
        return empty_response


async def get_user_weekly_xp(
    redis: Redis | None,
    user_id: UUID,
) -> int:
    """Kullanıcının bu haftaki toplam XP'sini döner.

    Args:
        redis: Redis client.
        user_id: Kullanıcının UUID'si.

    Returns:
        Haftalık XP (Redis yoksa veya kullanıcı bulunamazsa 0).
    """
    if redis is None:
        return 0

    try:
        week_key = _get_week_key()
        score = await redis.zscore(week_key, str(user_id))
        return int(score) if score is not None else 0
    except Exception as exc:
        logger.warning("Haftalık XP alınamadı: %s", exc)
        return 0


async def reset_weekly_leaderboard(redis: Redis | None) -> None:
    """Haftalık liderboard'u sıfırlar.

    TODO: Her pazartesi çalışacak cron job ile entegre edilecek.

    Args:
        redis: Redis client.
    """
    # TODO: Celery Beat veya APScheduler ile her pazartesi 00:00 UTC'de çalıştır
    if redis is None:
        return

    try:
        week_key = _get_week_key()
        await redis.delete(week_key)
        logger.info("Haftalık liderboard sıfırlandı: %s", week_key)
    except Exception as exc:
        logger.warning("Liderboard sıfırlanamadı: %s", exc)
