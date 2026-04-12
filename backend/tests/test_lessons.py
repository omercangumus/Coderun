# Coderun backend — lesson endpoint entegrasyon testleri.

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_lessons_by_module_slug(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Modül ID'sine göre ders listesi alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get modules first
    modules_response = await client.get("/api/v1/modules", headers=headers)
    modules = modules_response.json()
    
    if len(modules) > 0:
        module_slug = modules[0]["slug"]
        
        # Get lessons by module slug
        response = await client.get(
            f"/api/v1/lessons/module/{module_slug}",
            headers=headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_lessons_unauthorized(client: AsyncClient) -> None:
    """Token olmadan ders listesi alınamaz."""
    import uuid
    module_id = uuid.uuid4()
    response = await client.get(f"/api/v1/lessons/module/{module_id}")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_lesson_detail(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Ders detayı sorularla birlikte alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get modules first
    modules_response = await client.get("/api/v1/modules", headers=headers)
    modules = modules_response.json()
    
    if len(modules) > 0:
        module_slug = modules[0]["slug"]
        
        # Get lessons
        lessons_response = await client.get(
            f"/api/v1/lessons/module/{module_slug}",
            headers=headers,
        )
        lessons = lessons_response.json()
        
        if len(lessons) > 0:
            lesson_id = lessons[0]["id"]
            
            # Get lesson detail
            response = await client.get(
                f"/api/v1/lessons/{lesson_id}",
                headers=headers,
            )
            assert response.status_code == 200
            data = response.json()
            assert "id" in data
            assert "questions" in data


@pytest.mark.asyncio
async def test_get_lesson_detail_unauthorized(client: AsyncClient) -> None:
    """Token olmadan ders detayı alınamaz."""
    import uuid
    lesson_id = uuid.uuid4()
    response = await client.get(f"/api/v1/lessons/{lesson_id}")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_lesson_answer(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Ders cevabı gönderilebilmeli ve sonuç alınabilmeli."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get modules first
    modules_response = await client.get("/api/v1/modules", headers=headers)
    modules = modules_response.json()
    
    if len(modules) > 0:
        module_slug = modules[0]["slug"]
        
        # Get lessons
        lessons_response = await client.get(
            f"/api/v1/lessons/module/{module_slug}",
            headers=headers,
        )
        lessons = lessons_response.json()
        
        if len(lessons) > 0:
            lesson_id = lessons[0]["id"]
            
            # Get lesson detail with questions
            detail_response = await client.get(
                f"/api/v1/lessons/{lesson_id}",
                headers=headers,
            )
            detail = detail_response.json()
            
            if len(detail.get("questions", [])) > 0:
                # Submit answers
                answers = []
                for question in detail["questions"]:
                    answers.append({
                        "question_id": question["id"],
                        "answer": "A",  # Test answer
                    })
                
                response = await client.post(
                    f"/api/v1/lessons/{lesson_id}/submit",
                    headers=headers,
                    json=answers,  # Send list directly
                )
                assert response.status_code == 200
                data = response.json()
                assert "score" in data
                assert "xp_earned" in data
                assert "is_completed" in data


@pytest.mark.asyncio
async def test_submit_lesson_unauthorized(client: AsyncClient) -> None:
    """Token olmadan ders cevabı gönderilemez."""
    import uuid
    lesson_id = uuid.uuid4()
    response = await client.post(
        f"/api/v1/lessons/{lesson_id}/submit",
        json={"answers": []},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_lesson_invalid_lesson_id(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Geçersiz lesson_id ile cevap gönderilemez."""
    # Login
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    import uuid
    invalid_lesson_id = uuid.uuid4()
    
    response = await client.post(
        f"/api/v1/lessons/{invalid_lesson_id}/submit",
        headers=headers,
        json=[],  # Send empty list directly
    )
    assert response.status_code in [404, 400]
