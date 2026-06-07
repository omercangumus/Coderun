# Coderun backend — LLM servisi ve /mentor/ask endpoint testleri.
# httpx mock'lanır; gerçek OpenRouter API çağrısı yapılmaz.

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import AsyncClient

from app.services.llm_service import (
    MENTOR_SYSTEM_PROMPT,
    _get_attempt_instruction,
    build_user_message,
)


# ---------------------------------------------------------------------------
# Pure function testleri
# ---------------------------------------------------------------------------


def test_build_user_message_includes_all_fields():
    """build_user_message tüm alanları içermeli."""
    msg = build_user_message(
        message="for döngüsü nedir?",
        user_level="beginner",
        learning_path="python",
        attempt_count=1,
    )
    assert "for döngüsü nedir?" in msg
    assert "beginner" in msg
    assert "python" in msg
    assert "1" in msg


def test_build_user_message_no_learning_path():
    """learning_path None olduğunda mesaj yine de oluşturulmalı."""
    msg = build_user_message(
        message="Docker nedir?",
        user_level="intermediate",
        learning_path=None,
        attempt_count=2,
    )
    assert "Docker nedir?" in msg
    assert "intermediate" in msg
    # learning_path satırı olmamalı
    assert "Öğrenme yolu" not in msg


def test_build_user_message_includes_quiz_context():
    """Quiz bağlam alanları mesaja eklenmeli."""
    msg = build_user_message(
        message="Boşluğa ne gelir?",
        user_level="beginner",
        learning_path="python",
        attempt_count=4,
        question_text="len() sorusu",
        lesson_title="Python Hızlı Pratik",
        question_type="code_completion",
        code_block="sonuc = ___('Coderun')",
    )
    assert "Python Hızlı Pratik" in msg
    assert "code_completion" in msg
    assert "len() sorusu" in msg
    assert "sonuc = ___('Coderun')" in msg
    assert "4" in msg


def test_attempt_instruction_first_attempt():
    """İlk denemede sadece ipucu talimatı gelmeli."""
    instruction = _get_attempt_instruction(1)
    assert "ipucu" in instruction.lower()
    assert "cevabı verme" in instruction.lower()


def test_attempt_instruction_second_attempt():
    """İkinci denemede daha açık ipucu talimatı gelmeli."""
    instruction = _get_attempt_instruction(2)
    assert "ikinci" in instruction.lower()


def test_attempt_instruction_third_attempt():
    """Üçüncü denemede örnek gösterme talimatı gelmeli."""
    instruction = _get_attempt_instruction(3)
    assert "örnek" in instruction.lower()


def test_attempt_instruction_fourth_or_more():
    """4+ denemelerde öneri modu talimatı gelmeli."""
    for count in [4, 10]:
        instruction = _get_attempt_instruction(count)
        assert "öneri" in instruction.lower()


def test_system_prompt_contains_rules():
    """Sistem promptu temel kuralları içermeli."""
    assert "Türkçe" in MENTOR_SYSTEM_PROMPT
    assert "doğrudan sınav cevabını vermek değil" in MENTOR_SYSTEM_PROMPT
    assert "Python" in MENTOR_SYSTEM_PROMPT
    assert "DevOps" in MENTOR_SYSTEM_PROMPT


# ---------------------------------------------------------------------------
# call_llm testleri
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_call_llm_missing_api_key():
    """API key yoksa ValueError fırlatılmalı."""
    from app.services.llm_service import call_llm

    with patch("app.services.llm_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = ""
        with pytest.raises(ValueError, match="OPENROUTER_API_KEY"):
            await call_llm("test mesajı")


@pytest.mark.asyncio
async def test_call_llm_success():
    """Başarılı API çağrısında (answer, model) tuple dönmeli."""
    from app.services.llm_service import call_llm

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "Bir ipucu: for döngüsünü dene."}}],
        "model": "mistralai/mistral-small-3.2-24b-instruct",
    }
    mock_response.raise_for_status = MagicMock()

    with patch("app.services.llm_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "test-key"
        mock_settings.OPENROUTER_MODEL = "mistralai/mistral-small-3.2-24b-instruct"
        mock_settings.OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
        mock_settings.OPENROUTER_TEMPERATURE = 0.3
        mock_settings.OPENROUTER_MAX_TOKENS = 512
        mock_settings.OPENROUTER_SITE_URL = "https://coderun.com"
        mock_settings.OPENROUTER_SITE_NAME = "Coderun"
        mock_settings.OPENROUTER_TIMEOUT_SECONDS = 30.0

        with patch("httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.post = AsyncMock(return_value=mock_response)
            mock_client_cls.return_value.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=False)

            answer, model = await call_llm(
                message="for döngüsü nedir?",
                user_level="beginner",
                learning_path="python",
                attempt_count=1,
            )

    assert answer == "Bir ipucu: for döngüsünü dene."
    assert model == "mistralai/mistral-small-3.2-24b-instruct"


@pytest.mark.asyncio
async def test_call_llm_401_raises_runtime_error():
    """401 yanıtında RuntimeError fırlatılmalı."""
    from app.services.llm_service import call_llm

    mock_response = MagicMock()
    mock_response.status_code = 401

    with patch("app.services.llm_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "invalid-key"
        mock_settings.OPENROUTER_MODEL = "test-model"
        mock_settings.OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
        mock_settings.OPENROUTER_TEMPERATURE = 0.3
        mock_settings.OPENROUTER_MAX_TOKENS = 512
        mock_settings.OPENROUTER_SITE_URL = "https://coderun.com"
        mock_settings.OPENROUTER_SITE_NAME = "Coderun"
        mock_settings.OPENROUTER_TIMEOUT_SECONDS = 30.0

        with patch("httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.post = AsyncMock(return_value=mock_response)
            mock_client_cls.return_value.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="geçersiz"):
                await call_llm("test")


@pytest.mark.asyncio
async def test_call_llm_timeout_raises_runtime_error():
    """Timeout durumunda RuntimeError fırlatılmalı."""
    import httpx as _httpx

    from app.services.llm_service import call_llm

    with patch("app.services.llm_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "test-key"
        mock_settings.OPENROUTER_MODEL = "test-model"
        mock_settings.OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
        mock_settings.OPENROUTER_TEMPERATURE = 0.3
        mock_settings.OPENROUTER_MAX_TOKENS = 512
        mock_settings.OPENROUTER_SITE_URL = "https://coderun.com"
        mock_settings.OPENROUTER_SITE_NAME = "Coderun"
        mock_settings.OPENROUTER_TIMEOUT_SECONDS = 5.0

        with patch("httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.post = AsyncMock(
                side_effect=_httpx.TimeoutException("timeout")
            )
            mock_client_cls.return_value.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="timed out"):
                await call_llm("test")


# ---------------------------------------------------------------------------
# /mentor/ask endpoint testleri
# ---------------------------------------------------------------------------

ASK_URL = "/api/v1/mentor/ask"


@pytest.mark.asyncio
async def test_ask_mentor_without_auth(client: AsyncClient):
    """Token olmadan 401 dönmeli."""
    response = await client.post(ASK_URL, json={"message": "Python nedir?"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_ask_mentor_empty_message(client: AsyncClient, test_user: dict):
    """Boş mesaj 422 dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.post(
        ASK_URL,
        json={"message": ""},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ask_mentor_message_too_long(client: AsyncClient, test_user: dict):
    """4001 karakterlik mesaj 422 dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.post(
        ASK_URL,
        json={"message": "x" * 4001},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ask_mentor_attempt_count_zero(client: AsyncClient, test_user: dict):
    """attempt_count=0 422 dönmeli (minimum 1)."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    response = await client.post(
        ASK_URL,
        json={"message": "test", "attempt_count": 0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ask_mentor_success(client: AsyncClient, test_user: dict):
    """Başarılı istek answer ve model alanlarını dönmeli."""
    from app.services.llm_service import call_llm

    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    with patch(
        "app.api.v1.endpoints.mentor.call_llm",
        new=AsyncMock(
            return_value=("Bir ipucu: for döngüsünü incele.", "mistralai/mistral-small-3.2-24b-instruct")
        ),
    ):
        response = await client.post(
            ASK_URL,
            json={
                "message": "Python for döngüsünü anlamadım",
                "user_level": "beginner",
                "learning_path": "python",
                "attempt_count": 1,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["answer"] == "Bir ipucu: for döngüsünü incele."


@pytest.mark.asyncio
async def test_ask_mentor_service_unavailable(client: AsyncClient, test_user: dict):
    """API key eksikse 503 dönmeli."""
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login.json()["access_token"]

    with patch(
        "app.api.v1.endpoints.mentor.call_llm",
        new=AsyncMock(side_effect=ValueError("OPENROUTER_API_KEY tanımlı değil")),
    ):
        response = await client.post(
            ASK_URL,
            json={"message": "test"},
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 503
