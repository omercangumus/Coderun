# Coderun backend — gamification endpoint'leri; liderboard, istatistik, rozet ve seviye API'leri.

from fastapi import APIRouter, Depends, Query

from backend.app.api.v1.dependencies import (
    get_badge_repository,
    get_current_active_user,
    get_progress_repository,
    get_redis,
    get_user_repository,
)
from backend.app.models.user import User
from backend.app.repositories.badge_repository import BadgeRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.gamification import (
    BadgeResponse,
    LeaderboardResponse,
    LevelProgressResponse,
    StreakResponse,
    UserStatsResponse,
)
from backend.app.services import gamification_service
from backend.app.services.leaderboard_service import get_weekly_leaderboard

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    limit: int = Query(default=10, ge=1, le=100),
    redis: object = Depends(get_redis),
    current_user: User = Depends(get_current_active_user),
) -> LeaderboardResponse:
    """Haftalık XP liderboard'unu döner.

    Auth gerekir. Redis down olsa bile boş liste döner.

    Args:
        limit: Döndürülecek maksimum kullanıcı sayısı (1–100).
        redis: Redis client bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Sıralı haftalık liderboard.
    """
    return await get_weekly_leaderboard(redis, current_user.id, limit)  # type: ignore[arg-type]


@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    user_repo: UserRepository = Depends(get_user_repository),
    progress_repo: ProgressRepository = Depends(get_progress_repository),
    badge_repo: BadgeRepository = Depends(get_badge_repository),
    current_user: User = Depends(get_current_active_user),
) -> UserStatsResponse:
    """Giriş yapan kullanıcının tüm istatistiklerini döner.

    Auth gerekir.

    Args:
        user_repo: Kullanıcı repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        badge_repo: Rozet repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        XP, seviye, streak, rozet ve ilerleme bilgisi.
    """
    stats = await progress_repo.get_user_stats(current_user.id)
    badges = await badge_repo.get_user_badges(current_user.id)
    badge_responses = [BadgeResponse.from_badge(b) for b in badges]

    xp_info = gamification_service.calculate_xp_for_next_level(current_user.xp)
    streak_alive = gamification_service.is_streak_alive(current_user.last_active_date)

    current_streak = current_user.streak
    next_milestone = (
        7 if current_streak < 7
        else 30 if current_streak < 30
        else 30
    )
    days_to_milestone = max(0, next_milestone - current_streak)

    level_progress = LevelProgressResponse(
        current_level=current_user.level,
        current_xp=current_user.xp,
        xp_needed_for_next=xp_info["xp_needed"],
        xp_remaining=xp_info["xp_remaining"],
        progress_percentage=xp_info["progress_percentage"],
        is_max_level=current_user.level >= 50,
    )

    streak_info = StreakResponse(
        current_streak=current_streak,
        last_active_date=current_user.last_active_date,
        is_alive=streak_alive,
        next_milestone=next_milestone,
        days_to_next_milestone=days_to_milestone,
    )

    return UserStatsResponse(
        total_xp=current_user.xp,
        level=current_user.level,
        streak=current_streak,
        total_lessons_completed=stats["completed_lessons"],
        total_modules_completed=stats["completed_modules"],
        badges=badge_responses,
        level_progress=level_progress,
        streak_info=streak_info,
    )


@router.get("/badges", response_model=list[BadgeResponse])
async def get_badges(
    badge_repo: BadgeRepository = Depends(get_badge_repository),
    current_user: User = Depends(get_current_active_user),
) -> list[BadgeResponse]:
    """Kullanıcının kazandığı rozetleri döner.

    Auth gerekir.

    Args:
        badge_repo: Rozet repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Kazanılan rozetlerin listesi.
    """
    badges = await badge_repo.get_user_badges(current_user.id)
    return [BadgeResponse.from_badge(b) for b in badges]


@router.get("/level-progress", response_model=LevelProgressResponse)
async def get_level_progress(
    current_user: User = Depends(get_current_active_user),
) -> LevelProgressResponse:
    """Kullanıcının seviye ilerlemesini döner.

    Auth gerekir.

    Args:
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Mevcut seviye, XP ve ilerleme yüzdesi.
    """
    xp_info = gamification_service.calculate_xp_for_next_level(current_user.xp)
    return LevelProgressResponse(
        current_level=current_user.level,
        current_xp=current_user.xp,
        xp_needed_for_next=xp_info["xp_needed"],
        xp_remaining=xp_info["xp_remaining"],
        progress_percentage=xp_info["progress_percentage"],
        is_max_level=current_user.level >= 50,
    )


@router.get("/streak", response_model=StreakResponse)
async def get_streak(
    current_user: User = Depends(get_current_active_user),
) -> StreakResponse:
    """Kullanıcının streak bilgisini döner.

    Auth gerekir.

    Args:
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Mevcut streak, son aktif tarih ve bir sonraki milestone.
    """
    streak_alive = gamification_service.is_streak_alive(current_user.last_active_date)
    current_streak = current_user.streak
    next_milestone = 7 if current_streak < 7 else 30 if current_streak < 30 else 30
    days_to_milestone = max(0, next_milestone - current_streak)

    return StreakResponse(
        current_streak=current_streak,
        last_active_date=current_user.last_active_date,
        is_alive=streak_alive,
        next_milestone=next_milestone,
        days_to_next_milestone=days_to_milestone,
    )
