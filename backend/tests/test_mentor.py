# Coderun backend — AI Mentor servis ve endpoint testleri.
# OpenRouter client mock'lanır; gerçek API çağrısı yapılmaz.

from __future__ import annotations

import time
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import AsyncClient

from app.core.rate_limiter import InMemoryRateLimiter
from app.schemas.mentor import ChatMessage, MentorContext, MentorRequest
from app.services.mentor_service import (
    build_messages,
    build_system_prompt,
)


# ---------------------------------------------------------------------------
# Yardımcı sabitler
# ---------------------------------------------------------------------------

CHAT_URL = "/api/v1/mentor/chat"
STATUS_URL = "/api/v1/mentor/status"


def _make_mock_completion(content: str = "Test yanıtı") -> MagicMock:
    """OpenAI completion mock nesnesi oluşturur."""
    mock = MagicMock()
    mock.choices[0].message.content = content
    return mock


# ---------------------------------------------------------------------------
# Pure function testleri — build_system_prompt
# ---------------------------------------------------------------------------


def test_build_system_prompt_python():
    """Python modül bağlamı prompt'a eklenmeli."""
    prompt = build_system_prompt(
        context="general",
        module_slug="python",
        lesson_title=None,
        question_text=None,
    )
    assert "Python" in prompt
    assert "değişkenler" in prompt


def test_build_system_prompt_devops():
    """DevOps modül bağlamı prompt'a eklenmeli."""
    prompt = build_system_prompt(
        context="general",
        module_slug="devops",
        lesson_title=None,
        question_text=None,
    )
    assert "DevOps" in prompt
    assert "Docker" in prompt


def test_build_system_prompt_lab():
    """Lab bağlamı prompt'a eklenmeli."""
    prompt = build_system_prompt(
        context="lab",
        module_slug=None,
        lesson_title=None,
        question_text=None,
    )
    assert "lab ortamında" in prompt


def test_build_system_prompt_with_lesson():
    """lesson_title prompt'a eklenmeli."""
    prompt = build_system_prompt(
        context="lesson",
        module_slug="python",
        lesson_title="Döngüler",
        question_text=None,
    )
    assert "Döngüler" in prompt


# ---------------------------------------------------------------------------
# Pure function testleri — build_messages
# ---------------------------------------------------------------------------


def test_build_messages_with_history():
    """Geçmiş mesajlar mesaj listesine eklenmeli."""
    history = [
        ChatMessage(role="user", content="Merhaba"),
        ChatMessage(role="assistant", content="Nasıl yardımcı olabilirim?"),
    ]
    messages = build_messages("System prompt", history, "Yeni soru")
    assert messages[0]["role"] == "system"
    assert messages[1]["content"] == "Merhaba"
    assert messages[2]["content"] == "Nasıl yardımcı olabilirim?"
    assert messages[-1]["role"] == "user"
    assert messages[-1]["content"] == "Yeni soru"


def test_build_messages_history_limit():
    """Geçmiş mesajlar MENTOR_MAX_HISTORY (10) ile sınırlandırılmalı."""
    history = [
        ChatMessage(role="user", content=f"Mesaj {i}") for i in range(20)
    ]
    messages = build_messages("System", history, "Son soru")
    # system + 10 geçmiş + 1 yeni = 12
    assert len(messages) == 12


# ---------------------------------------------------------------------------
# Rate limiter testleri
# ---------------------------------------------------------------------------


def test_rate_limiter_allows():
    """Limit altındaki istekler kabul edilmeli."""
    limiter = InMemoryRateLimiter()
    # Varsayılan limit 20; 5 istek gönder
    for _ in range(5):
        assert limiter.is_allowed("user_test_allow") is True


def test_rate_limiter_blocks():
    """Limit aşıldığında istek reddedilmeli."""
    limiter = InMemoryRateLimiter()
    user_id = "user_test_block"

    # Limiti doldur (20 istek)
    with patch("app.core.rate_limiter.settings") as mock_settings:
        mock_settings.MENTOR_RATE_LIMIT_PER_MINUTE = 5
        for _ in range(5):
            limiter.is_allowed(user_id)
        # 6. istek reddedilmeli
        assert limiter.is_allowed(user_id) is False


# ---------------------------------------------------------------------------
# Endpoint testleri
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_chat_without_auth(client: AsyncClient):
    """Token olmadan 401 dönmeli."""
    response = await client.post(
        CHAT_URL,
        json={"message": "Merhaba"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_chat_empty_message(client: AsyncClient, test_user: dict):
    """Boş mesaj 422 validation error dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.post(
        CHAT_URL,
        json={"message": ""},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_message_too_long(client: AsyncClient, test_user: dict):
    """1001 karakterlik mesaj 422 dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.post(
        CHAT_URL,
        json={"message": "a" * 1001},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_success(client: AsyncClient, test_user: dict):
    """Başarılı mentor yanıtı dönmeli."""
    from app.api.v1.dependencies import get_openrouter
    from app.main import app as fastapi_app

    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    mock_completion = _make_mock_completion("Bir ipucu: döngüleri dene!")
    mock_client = AsyncMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_completion)

    # FastAPI dependency override ile OpenRouter client'ı mock'la
    fastapi_app.dependency_overrides[get_openrouter] = lambda: mock_client

    try:
        with patch("app.services.mentor_service.settings") as mock_settings:
            mock_settings.OPENROUTER_MODEL = "test-model"
            mock_settings.OPENROUTER_MAX_TOKENS = 512
            mock_settings.OPENROUTER_TEMPERATURE = 0.3
            mock_settings.MENTOR_MAX_HISTORY = 10

            response = await client.post(
                CHAT_URL,
                json={"message": "Döngüler nasıl çalışır?"},
                headers={"Authorization": f"Bearer {token}"},
            )
    finally:
        fastapi_app.dependency_overrides.pop(get_openrouter, None)

    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "context" in data


@pytest.mark.asyncio
async def test_chat_rate_limit(client: AsyncClient, test_user: dict):
    """Rate limit aşıldığında 429 dönmeli."""
    from app.api.v1.dependencies import get_openrouter
    from app.core.rate_limiter import InMemoryRateLimiter
    from app.main import app as fastapi_app

    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    mock_completion = _make_mock_completion("Yanıt")
    mock_client = AsyncMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_completion)

    fastapi_app.dependency_overrides[get_openrouter] = lambda: mock_client

    # Limit=2 olan özel bir rate limiter oluştur ve endpoint'e inject et
    test_limiter = InMemoryRateLimiter()

    try:
        with patch("app.api.v1.endpoints.mentor.rate_limiter", test_limiter):
            with patch("app.core.rate_limiter.settings") as mock_settings:
                mock_settings.MENTOR_RATE_LIMIT_PER_MINUTE = 2

                with patch("app.services.mentor_service.settings") as mock_svc:
                    mock_svc.OPENROUTER_MODEL = "test-model"
                    mock_svc.OPENROUTER_MAX_TOKENS = 512
                    mock_svc.OPENROUTER_TEMPERATURE = 0.3
                    mock_svc.MENTOR_MAX_HISTORY = 10

                    # 2 istek gönder (limit dolu)
                    for _ in range(2):
                        await client.post(
                            CHAT_URL,
                            json={"message": "Test"},
                            headers={"Authorization": f"Bearer {token}"},
                        )

                    # 3. istek 429 dönmeli
                    response = await client.post(
                        CHAT_URL,
                        json={"message": "Test"},
                        headers={"Authorization": f"Bearer {token}"},
                    )
    finally:
        fastapi_app.dependency_overrides.pop(get_openrouter, None)

    assert response.status_code == 429


@pytest.mark.asyncio
async def test_mentor_status_endpoint(client: AsyncClient, test_user: dict):
    """Status endpoint çalışmalı ve gerekli alanları dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.get(
        STATUS_URL,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert "rate_limit_remaining" in data
    assert data["provider"] == "AI"
