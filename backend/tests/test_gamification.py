# Coderun backend — gamification servis unit ve integration testleri.

from __future__ import annotations

from datetime import date, timedelta
from unittest.mock import AsyncMock, MagicMock

import pytest

from backend.app.services.gamification_service import (
    calculate_level,
    calculate_new_streak,
    calculate_streak_bonus,
    calculate_xp_for_next_level,
    check_badges_to_award,
    is_streak_alive,
)


# ---------------------------------------------------------------------------
# calculate_level testleri
# ---------------------------------------------------------------------------


class TestCalculateLevel:
    """calculate_level pure function testleri."""

    def test_calculate_level_zero_xp(self) -> None:
        """0 XP → seviye 1."""
        assert calculate_level(0) == 1

    def test_calculate_level_99_xp(self) -> None:
        """99 XP → seviye 1 (eşik altı)."""
        assert calculate_level(99) == 1

    def test_calculate_level_100_xp(self) -> None:
        """100 XP → seviye 2."""
        assert calculate_level(100) == 2

    def test_calculate_level_199_xp(self) -> None:
        """199 XP → seviye 2."""
        assert calculate_level(199) == 2

    def test_calculate_level_200_xp(self) -> None:
        """200 XP → seviye 3."""
        assert calculate_level(200) == 3

    def test_calculate_level_max(self) -> None:
        """Çok yüksek XP → MAX_LEVEL (50) ile sınırlı."""
        from backend.app.core.config import settings
        assert calculate_level(999_999) == settings.MAX_LEVEL

    def test_calculate_level_negative_xp(self) -> None:
        """Negatif XP → seviye 1."""
        assert calculate_level(-100) == 1


# ---------------------------------------------------------------------------
# calculate_xp_for_next_level testleri
# ---------------------------------------------------------------------------


class TestCalculateXpForNextLevel:
    """calculate_xp_for_next_level pure function testleri."""

    def test_xp_progress_at_zero(self) -> None:
        """0 XP → %0 ilerleme."""
        result = calculate_xp_for_next_level(0)
        assert result["progress_percentage"] == 0.0
        assert result["current_level"] == 1

    def test_xp_progress_at_50(self) -> None:
        """50 XP → %50 ilerleme."""
        result = calculate_xp_for_next_level(50)
        assert result["progress_percentage"] == 50.0

    def test_xp_remaining_correct(self) -> None:
        """75 XP → 25 XP kaldı."""
        result = calculate_xp_for_next_level(75)
        assert result["xp_remaining"] == 25

    def test_xp_next_level_correct(self) -> None:
        """0 XP → bir sonraki seviye 2."""
        result = calculate_xp_for_next_level(0)
        assert result["next_level"] == 2


# ---------------------------------------------------------------------------
# calculate_streak_bonus testleri
# ---------------------------------------------------------------------------


class TestCalculateStreakBonus:
    """calculate_streak_bonus pure function testleri."""

    def test_streak_bonus_no_bonus_1_day(self) -> None:
        """1 günlük streak → bonus yok."""
        assert calculate_streak_bonus(1, 10) == 10

    def test_streak_bonus_no_bonus_6_days(self) -> None:
        """6 günlük streak → bonus yok."""
        assert calculate_streak_bonus(6, 10) == 10

    def test_streak_bonus_week_7_days(self) -> None:
        """7 günlük streak → %50 bonus."""
        result = calculate_streak_bonus(7, 10)
        assert result == 15  # 10 * 1.5

    def test_streak_bonus_week_29_days(self) -> None:
        """29 günlük streak → %50 bonus."""
        result = calculate_streak_bonus(29, 20)
        assert result == 30  # 20 * 1.5

    def test_streak_bonus_month_30_days(self) -> None:
        """30 günlük streak → %125 bonus."""
        result = calculate_streak_bonus(30, 10)
        assert result == 22  # int(10 * 1.5 * 1.5) = int(22.5) = 22

    def test_streak_bonus_month_50_days(self) -> None:
        """50 günlük streak → %125 bonus."""
        result = calculate_streak_bonus(50, 20)
        assert result == 45  # int(20 * 1.5 * 1.5) = int(45.0) = 45


# ---------------------------------------------------------------------------
# is_streak_alive testleri
# ---------------------------------------------------------------------------


class TestIsStreakAlive:
    """is_streak_alive pure function testleri."""

    def test_is_streak_alive_none(self) -> None:
        """last_active None → False."""
        assert is_streak_alive(None) is False

    def test_is_streak_alive_today(self) -> None:
        """Bugün aktif → True."""
        assert is_streak_alive(date.today()) is True

    def test_is_streak_alive_yesterday(self) -> None:
        """Dün aktif → True (36 saat içinde)."""
        yesterday = date.today() - timedelta(days=1)
        assert is_streak_alive(yesterday) is True

    def test_is_streak_alive_two_days_ago(self) -> None:
        """2 gün önce aktif → False (36 saat geçmiş)."""
        two_days_ago = date.today() - timedelta(days=2)
        assert is_streak_alive(two_days_ago) is False

    def test_is_streak_alive_week_ago(self) -> None:
        """1 hafta önce aktif → False."""
        week_ago = date.today() - timedelta(days=7)
        assert is_streak_alive(week_ago) is False


# ---------------------------------------------------------------------------
# calculate_new_streak testleri
# ---------------------------------------------------------------------------


class TestCalculateNewStreak:
    """calculate_new_streak pure function testleri."""

    def test_calculate_new_streak_first_day(self) -> None:
        """İlk gün (last_active None) → (1, today)."""
        today = date.today()
        streak, active_date = calculate_new_streak(0, None, today)
        assert streak == 1
        assert active_date == today

    def test_calculate_new_streak_consecutive(self) -> None:
        """Ardışık gün → streak + 1."""
        today = date.today()
        yesterday = today - timedelta(days=1)
        streak, active_date = calculate_new_streak(5, yesterday, today)
        assert streak == 6
        assert active_date == today

    def test_calculate_new_streak_broken(self) -> None:
        """Streak koptu (2+ gün ara) → (1, today)."""
        today = date.today()
        two_days_ago = today - timedelta(days=2)
        streak, active_date = calculate_new_streak(10, two_days_ago, today)
        assert streak == 1
        assert active_date == today

    def test_calculate_new_streak_same_day(self) -> None:
        """Aynı gün tekrar → streak değişmez."""
        today = date.today()
        streak, active_date = calculate_new_streak(7, today, today)
        assert streak == 7
        assert active_date == today


# ---------------------------------------------------------------------------
# check_badges_to_award testleri
# ---------------------------------------------------------------------------


class TestCheckBadgesToAward:
    """check_badges_to_award pure function testleri."""

    def _make_user(self) -> MagicMock:
        """Test için mock User nesnesi oluşturur."""
        user = MagicMock()
        user.xp = 0
        user.streak = 0
        user.level = 1
        return user

    def test_check_badges_first_lesson(self) -> None:
        """İlk ders tamamlandığında FIRST_LESSON rozeti verilmeli."""
        badges = check_badges_to_award(
            new_xp=10,
            new_streak=1,
            new_level=1,
            module_completed=False,
            existing_badges=[],
        )
        assert "first_lesson" in badges

    def test_check_badges_streak_7(self) -> None:
        """7 günlük streak → STREAK_7 rozeti."""
        badges = check_badges_to_award(
            new_xp=10,
            new_streak=7,
            new_level=1,
            module_completed=False,
            existing_badges=["first_lesson"],
        )
        assert "streak_7" in badges

    def test_check_badges_streak_30(self) -> None:
        """30 günlük streak → STREAK_30 rozeti."""
        badges = check_badges_to_award(
            new_xp=10,
            new_streak=30,
            new_level=1,
            module_completed=False,
            existing_badges=["first_lesson", "streak_7"],
        )
        assert "streak_30" in badges

    def test_check_badges_module_complete(self) -> None:
        """Modül tamamlandığında MODULE_COMPLETE rozeti."""
        badges = check_badges_to_award(
            new_xp=100,
            new_streak=1,
            new_level=2,
            module_completed=True,
            existing_badges=["first_lesson"],
        )
        assert "module_complete" in badges

    def test_check_badges_level_5(self) -> None:
        """Seviye 5 → LEVEL_5 rozeti."""
        badges = check_badges_to_award(
            new_xp=500,
            new_streak=1,
            new_level=5,
            module_completed=False,
            existing_badges=["first_lesson"],
        )
        assert "level_5" in badges

    def test_check_badges_level_10(self) -> None:
        """Seviye 10 → LEVEL_10 rozeti."""
        badges = check_badges_to_award(
            new_xp=1000,
            new_streak=1,
            new_level=10,
            module_completed=False,
            existing_badges=["first_lesson", "level_5"],
        )
        assert "level_10" in badges

    def test_check_badges_no_duplicate(self) -> None:
        """Zaten kazanılmış rozet tekrar verilmemeli."""
        badges = check_badges_to_award(
            new_xp=10,
            new_streak=7,
            new_level=1,
            module_completed=False,
            existing_badges=["first_lesson", "streak_7"],
        )
        assert "first_lesson" not in badges
        assert "streak_7" not in badges

    def test_check_badges_empty_when_no_conditions_met(self) -> None:
        """Hiçbir koşul sağlanmıyorsa boş liste döner."""
        badges = check_badges_to_award(
            new_xp=0,
            new_streak=0,
            new_level=1,
            module_completed=False,
            existing_badges=[],
        )
        assert badges == []


# ---------------------------------------------------------------------------
# Leaderboard integration testleri (Redis mock)
# ---------------------------------------------------------------------------


class TestLeaderboard:
    """Leaderboard servis testleri (Redis mock ile)."""

    @pytest.mark.asyncio
    async def test_leaderboard_add_and_get(self) -> None:
        """XP eklenince liderboard'da görünmeli."""
        import uuid
        from backend.app.services.leaderboard_service import (
            add_xp_to_leaderboard,
        )

        mock_redis = AsyncMock()
        mock_redis.zincrby = AsyncMock()
        mock_redis.expire = AsyncMock()
        mock_redis.hset = AsyncMock()
        mock_redis.zrevrange = AsyncMock(return_value=[(str(uuid.uuid4()), 50.0)])
        mock_redis.zcard = AsyncMock(return_value=1)
        mock_redis.hgetall = AsyncMock(return_value={"username": "testuser", "level": "1", "streak": "3"})
        mock_redis.zrevrank = AsyncMock(return_value=0)

        user_id = uuid.uuid4()
        await add_xp_to_leaderboard(mock_redis, user_id, "testuser", 50)
        mock_redis.zincrby.assert_called_once()

    @pytest.mark.asyncio
    async def test_leaderboard_ranking(self) -> None:
        """Birden fazla kullanıcı sıralaması doğru olmalı."""
        import uuid
        from backend.app.services.leaderboard_service import get_weekly_leaderboard

        uid1, uid2 = str(uuid.uuid4()), str(uuid.uuid4())
        mock_redis = AsyncMock()
        mock_redis.zrevrange = AsyncMock(return_value=[
            (uid1, 100.0),
            (uid2, 50.0),
        ])
        mock_redis.zcard = AsyncMock(return_value=2)
        mock_redis.hgetall = AsyncMock(return_value={"username": "user", "level": "1", "streak": "0"})
        mock_redis.zrevrank = AsyncMock(return_value=None)

        result = await get_weekly_leaderboard(mock_redis, None, 10)
        assert len(result.entries) == 2
        assert result.entries[0].rank == 1
        assert result.entries[1].rank == 2
        assert result.entries[0].weekly_xp == 100

    @pytest.mark.asyncio
    async def test_user_weekly_xp(self) -> None:
        """Kullanıcının haftalık XP'si doğru hesaplanmalı."""
        import uuid
        from backend.app.services.leaderboard_service import get_user_weekly_xp

        mock_redis = AsyncMock()
        mock_redis.zscore = AsyncMock(return_value=75.0)

        user_id = uuid.uuid4()
        xp = await get_user_weekly_xp(mock_redis, user_id)
        assert xp == 75

    @pytest.mark.asyncio
    async def test_user_weekly_xp_none(self) -> None:
        """Kullanıcı liderboard'da yoksa 0 döner."""
        import uuid
        from backend.app.services.leaderboard_service import get_user_weekly_xp

        mock_redis = AsyncMock()
        mock_redis.zscore = AsyncMock(return_value=None)

        user_id = uuid.uuid4()
        xp = await get_user_weekly_xp(mock_redis, user_id)
        assert xp == 0

    @pytest.mark.asyncio
    async def test_leaderboard_redis_none_returns_empty(self) -> None:
        """Redis None ise boş liderboard döner."""
        from backend.app.services.leaderboard_service import get_weekly_leaderboard

        result = await get_weekly_leaderboard(None, None, 10)
        assert result.entries == []
        assert result.total_count == 0
