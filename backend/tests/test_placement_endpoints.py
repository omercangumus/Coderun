# Coderun backend — placement test endpoint entegrasyon testleri.

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_placement_test(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Seviye testi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get placement test
    response = await client.get(
        "/api/v1/placement/python",
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "module_id" in data
    assert "module_title" in data
    assert "questions" in data
    assert "total_questions" in data


@pytest.mark.asyncio
async def test_get_placement_test_not_found(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Olmayan modül için seviye testi 404 döndürmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get placement test for non-existent module
    response = await client.get(
        "/api/v1/placement/nonexistent",
        headers=headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_placement_test_unauthorized(client: AsyncClient) -> None:
    """Token olmadan seviye testi alınamaz."""
    response = await client.get("/api/v1/placement/python")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_placement_test(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Seviye testi cevapları gönderilebilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get placement test first
    test_response = await client.get(
        "/api/v1/placement/python",
        headers=headers,
    )
    test_data = test_response.json()
    
    # Submit answers
    answers = []
    for question in test_data.get("questions", []):
        answers.append({
            "question_id": question["id"],
            "answer": "A",  # Test answer
        })
    
    response = await client.post(
        "/api/v1/placement/python/submit",
        headers=headers,
        json=answers,  # Send list directly, not wrapped in {"answers": ...}
    )
    assert response.status_code == 200
    data = response.json()
    assert "correct_count" in data
    assert "total_count" in data
    assert "percentage" in data
    assert "starting_lesson_order" in data
    assert "skipped_lessons" in data


@pytest.mark.asyncio
async def test_submit_placement_test_not_found(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Olmayan modül için seviye testi cevabı 404 döndürmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit for non-existent module
    response = await client.post(
        "/api/v1/placement/nonexistent/submit",
        headers=headers,
        json=[],  # Send empty list directly
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_submit_placement_test_unauthorized(client: AsyncClient) -> None:
    """Token olmadan seviye testi cevabı gönderilemez."""
    response = await client.post(
        "/api/v1/placement/python/submit",
        json={"answers": []},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_placement_test_empty_answers(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Boş cevap listesi ile seviye testi gönderilebilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit empty answers
    response = await client.post(
        "/api/v1/placement/python/submit",
        headers=headers,
        json=[],  # Send empty list directly
    )
    # Should return result with 0 correct
    assert response.status_code in [200, 400]
