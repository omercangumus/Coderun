# Coderun backend — gamification endpoint entegrasyon testleri.

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_leaderboard(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard listesi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard
    response = await client.get(
        "/api/v1/gamification/leaderboard",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "entries" in data
    assert "total_count" in data
    assert isinstance(data["entries"], list)


@pytest.mark.asyncio
async def test_get_leaderboard_with_limit(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard limit parametresi ile alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard with limit
    response = await client.get(
        "/api/v1/gamification/leaderboard?limit=5",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["entries"]) <= 5


@pytest.mark.asyncio
async def test_get_leaderboard_unauthorized(client: AsyncClient) -> None:
    """Token olmadan liderboard alınamaz."""
    response = await client.get("/api/v1/gamification/leaderboard")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_user_stats(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Kullanıcı istatistikleri alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get user stats
    response = await client.get(
        "/api/v1/gamification/stats",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_xp" in data
    assert "level" in data
    assert "streak" in data
    assert "badges" in data
    assert "level_progress" in data
    assert "streak_info" in data


@pytest.mark.asyncio
async def test_get_user_stats_unauthorized(client: AsyncClient) -> None:
    """Token olmadan kullanıcı istatistikleri alınamaz."""
    response = await client.get("/api/v1/gamification/stats")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_badges(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Kullanıcı rozetleri alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get badges
    response = await client.get(
        "/api/v1/gamification/badges",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_badges_unauthorized(client: AsyncClient) -> None:
    """Token olmadan rozet listesi alınamaz."""
    response = await client.get("/api/v1/gamification/badges")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_level_progress(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Seviye ilerlemesi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get level progress
    response = await client.get(
        "/api/v1/gamification/level-progress",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "current_level" in data
    assert "current_xp" in data
    assert "xp_needed_for_next" in data
    assert "progress_percentage" in data


@pytest.mark.asyncio
async def test_get_level_progress_unauthorized(client: AsyncClient) -> None:
    """Token olmadan seviye ilerlemesi alınamaz."""
    response = await client.get("/api/v1/gamification/level-progress")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_streak(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Streak bilgisi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get streak
    response = await client.get(
        "/api/v1/gamification/streak",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "current_streak" in data
    assert "is_alive" in data
    assert "last_active_date" in data


@pytest.mark.asyncio
async def test_get_streak_unauthorized(client: AsyncClient) -> None:
    """Token olmadan streak bilgisi alınamaz."""
    response = await client.get("/api/v1/gamification/streak")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_leaderboard_invalid_limit_too_low(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard limit 1'den küçük olamaz."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard with invalid limit
    response = await client.get(
        "/api/v1/gamification/leaderboard?limit=0",
        headers=headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_leaderboard_invalid_limit_too_high(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard limit 100'den büyük olamaz."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard with invalid limit
    response = await client.get(
        "/api/v1/gamification/leaderboard?limit=101",
        headers=headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_leaderboard_invalid_limit_string(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard limit string olamaz."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard with invalid limit (string)
    response = await client.get(
        "/api/v1/gamification/leaderboard?limit=abc",
        headers=headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_leaderboard_invalid_limit_negative(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Liderboard limit negatif olamaz."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get leaderboard with negative limit
    response = await client.get(
        "/api/v1/gamification/leaderboard?limit=-5",
        headers=headers,
    )
    assert response.status_code == 422
