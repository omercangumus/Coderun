# Coderun backend leaderboard service testleri — Redis liderboard servis katmanı.

from uuid import uuid4

import pytest
from unittest.mock import AsyncMock, MagicMock

from backend.app.services.leaderboard_service import (
    add_xp_to_leaderboard,
    get_weekly_leaderboard,
    get_user_weekly_xp,
    reset_weekly_leaderboard,
)


@pytest.mark.asyncio
class TestAddXpToLeaderboard:
    """add_xp_to_leaderboard fonksiyonu testleri."""

    async def test_add_xp_success(self) -> None:
        """Redis'e XP ekleme başarılı olmalı."""
        mock_redis = AsyncMock()
        mock_redis.zincrby = AsyncMock(return_value=None)
        mock_redis.expire = AsyncMock(return_value=None)
        mock_redis.hset = AsyncMock(return_value=None)

        user_id = uuid4()
        await add_xp_to_leaderboard(
            mock_redis, user_id, "test_user", 50, level=2, streak=5
        )

        # zincrby çağrıldı mı?
        assert mock_redis.zincrby.called
        # hset çağrıldı mı?
        assert mock_redis.hset.called
        # expire çağrıldı mı?
        assert mock_redis.expire.call_count == 2

    async def test_add_xp_redis_none(self) -> None:
        """Redis None ise işlem atlanmalı."""
        user_id = uuid4()
        # Hata fırlatmamalı
        await add_xp_to_leaderboard(None, user_id, "test_user", 50)

    async def test_add_xp_redis_error_handling(self) -> None:
        """Redis hatası durumunda exception yakalanmalı ve loglanmalı."""
        mock_redis = AsyncMock()
        mock_redis.zincrby = AsyncMock(side_effect=Exception("Redis error"))

        user_id = uuid4()
        # Hata fırlatmamalı, sadece loglanmalı
        await add_xp_to_leaderboard(
            mock_redis, user_id, "test_user", 50, level=1, streak=0
        )


@pytest.mark.asyncio
class TestGetWeeklyLeaderboard:
    """get_weekly_leaderboard fonksiyonu testleri."""

    async def test_get_leaderboard_success(self) -> None:
        """Liderboard başarıyla getirilmeli."""
        mock_redis = AsyncMock()
        user_id = uuid4()
        user_id_str = str(user_id)

        # Mock zrevrange response: [(member, score), ...]
        mock_redis.zrevrange = AsyncMock(return_value=[
            (user_id_str, 100.0),
        ])
        mock_redis.zcard = AsyncMock(return_value=1)
        mock_redis.hgetall = AsyncMock(return_value={
            "username": "test_user",
            "level": "2",
            "streak": "5",
        })
        mock_redis.zrevrank = AsyncMock(return_value=0)

        result = await get_weekly_leaderboard(mock_redis, user_id=user_id, limit=10)

        assert result.total_count == 1
        assert len(result.entries) == 1
        assert result.entries[0].username == "test_user"
        assert result.entries[0].weekly_xp == 100
        assert result.user_rank == 1

    async def test_get_leaderboard_redis_none(self) -> None:
        """Redis None ise boş yanıt döndürmeli."""
        result = await get_weekly_leaderboard(None, user_id=None, limit=10)

        assert result.total_count == 0
        assert len(result.entries) == 0
        assert result.user_rank is None

    async def test_get_leaderboard_empty_list(self) -> None:
        """Redis'te veri yoksa boş liste döndürmeli."""
        mock_redis = AsyncMock()
        mock_redis.zrevrange = AsyncMock(return_value=[])
        mock_redis.zcard = AsyncMock(return_value=0)

        result = await get_weekly_leaderboard(mock_redis, user_id=None, limit=10)

        assert result.total_count == 0
        assert len(result.entries) == 0

    async def test_get_leaderboard_redis_error_handling(self) -> None:
        """Redis hatası durumunda boş yanıt döndürmeli."""
        mock_redis = AsyncMock()
        mock_redis.zrevrange = AsyncMock(side_effect=Exception("Redis error"))

        result = await get_weekly_leaderboard(mock_redis, user_id=None, limit=10)

        assert result.total_count == 0
        assert len(result.entries) == 0

    async def test_get_leaderboard_user_rank_not_found(self) -> None:
        """Kullanıcı liderboard'da yoksa user_rank None olmalı."""
        mock_redis = AsyncMock()
        user_id = uuid4()

        mock_redis.zrevrange = AsyncMock(return_value=[])
        mock_redis.zcard = AsyncMock(return_value=0)
        mock_redis.zrevrank = AsyncMock(return_value=None)

        result = await get_weekly_leaderboard(mock_redis, user_id=user_id, limit=10)

        assert result.user_rank is None


@pytest.mark.asyncio
class TestGetUserWeeklyXp:
    """get_user_weekly_xp fonksiyonu testleri."""

    async def test_get_user_xp_success(self) -> None:
        """Kullanıcının haftalık XP'si başarıyla getirilmeli."""
        mock_redis = AsyncMock()
        mock_redis.zscore = AsyncMock(return_value=150.0)

        user_id = uuid4()
        xp = await get_user_weekly_xp(mock_redis, user_id)

        assert xp == 150

    async def test_get_user_xp_redis_none(self) -> None:
        """Redis None ise 0 döndürmeli."""
        user_id = uuid4()
        xp = await get_user_weekly_xp(None, user_id)

        assert xp == 0

    async def test_get_user_xp_user_not_found(self) -> None:
        """Kullanıcı bulunamazsa 0 döndürmeli."""
        mock_redis = AsyncMock()
        mock_redis.zscore = AsyncMock(return_value=None)

        user_id = uuid4()
        xp = await get_user_weekly_xp(mock_redis, user_id)

        assert xp == 0

    async def test_get_user_xp_redis_error(self) -> None:
        """Redis hatası durumunda 0 döndürmeli."""
        mock_redis = AsyncMock()
        mock_redis.zscore = AsyncMock(side_effect=Exception("Redis error"))

        user_id = uuid4()
        xp = await get_user_weekly_xp(mock_redis, user_id)

        assert xp == 0


@pytest.mark.asyncio
class TestResetWeeklyLeaderboard:
    """reset_weekly_leaderboard fonksiyonu testleri."""

    async def test_reset_leaderboard_success(self) -> None:
        """Liderboard başarıyla sıfırlanmalı."""
        mock_redis = AsyncMock()
        mock_redis.delete = AsyncMock(return_value=1)

        await reset_weekly_leaderboard(mock_redis)

        assert mock_redis.delete.called

    async def test_reset_leaderboard_redis_none(self) -> None:
        """Redis None ise işlem atlanmalı."""
        # Hata fırlatmamalı
        await reset_weekly_leaderboard(None)

    async def test_reset_leaderboard_redis_error(self) -> None:
        """Redis hatası durumunda exception yakalanmalı."""
        mock_redis = AsyncMock()
        mock_redis.delete = AsyncMock(side_effect=Exception("Redis error"))

        # Hata fırlatmamalı, sadece loglanmalı
        await reset_weekly_leaderboard(mock_redis)
