# Coderun backend — module endpoint entegrasyon testleri.

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_modules(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Modül listesi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get modules
    response = await client.get(
        "/api/v1/modules",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_modules_unauthorized(client: AsyncClient) -> None:
    """Token olmadan modül listesi alınabilir (public endpoint)."""
    response = await client.get("/api/v1/modules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_module_by_slug(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Modül slug ile alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get module by slug
    response = await client.get(
        "/api/v1/modules/python",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "slug" in data
    assert data["slug"] == "python"
    assert "lessons" in data


@pytest.mark.asyncio
async def test_get_module_by_slug_not_found(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Olmayan modül slug'ı 404 döndürmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get non-existent module
    response = await client.get(
        "/api/v1/modules/nonexistent",
        headers=headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_module_by_slug_unauthorized(client: AsyncClient) -> None:
    """Token olmadan modül detayı alınabilir (public endpoint)."""
    response = await client.get("/api/v1/modules/python")
    # Seed data varsa 200, yoksa 404
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_get_module_progress(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Modül ilerlemesi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get module progress
    response = await client.get(
        "/api/v1/modules/python/progress",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "module" in data
    assert "completion_rate" in data
    assert "completed_lessons" in data
    assert "total_lessons" in data


@pytest.mark.asyncio
async def test_get_module_progress_not_found(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Olmayan modül için ilerleme 404 döndürmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get progress for non-existent module
    response = await client.get(
        "/api/v1/modules/nonexistent/progress",
        headers=headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_module_progress_unauthorized(client: AsyncClient) -> None:
    """Token olmadan modül ilerlemesi alınamaz."""
    response = await client.get("/api/v1/modules/python/progress")
    assert response.status_code == 401
