# Coderun backend — LLM servisi; httpx ile direkt OpenRouter HTTP API çağrısı.
# Bu modül OpenAI SDK kullanmaz; saf httpx ile çalışır.
# API key yalnızca backend ortam değişkeninden okunur, asla frontend'e açılmaz.

from __future__ import annotations

import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Sistem promptu
# ---------------------------------------------------------------------------

MENTOR_SYSTEM_PROMPT = """Sen Coderun platformunda çalışan bir AI mentorsun.
Coderun; Python, DevOps, Cloud ve Infrastructure as Code öğrenme yolları sunan bir eğitim platformudur.
Görevin kullanıcıya direkt cevabı vermek değil, öğrenmesini sağlamaktır.

Kurallar:
- Türkçe konuş.
- Kısa, net ve öğretici cevap ver.
- Kullanıcı soru çözerken final cevabı doğrudan verme.
- Önce hangi konuyu çalışması gerektiğini söyle.
- Sonra küçük bir ipucu ver.
- Kullanıcı tekrar takılırsa daha açık anlat.
- Kullanıcı çok zorlanırsa küçük örnek göster.
- Python konularında sade anlat.
- DevOps, Cloud ve IaC konularında pratik örneklerle açıkla.
- Gereksiz akademik veya uzun cevap verme."""

# ---------------------------------------------------------------------------
# Attempt count'a göre yönlendirme talimatları
# ---------------------------------------------------------------------------

_ATTEMPT_HINTS: dict[int, str] = {
    1: "Kullanıcı bu soruyu ilk kez soruyor. Sadece küçük bir ipucu ver, cevabı verme.",
    2: "Kullanıcı ikinci kez soruyor. Biraz daha açık bir ipucu verebilirsin ama yine de cevabı doğrudan verme.",
}
_ATTEMPT_HINT_DEFAULT = (
    "Kullanıcı birden fazla kez takıldı. "
    "Mantığı açıklayan küçük bir örnek gösterebilirsin, ama yine de kullanıcının kendisinin tamamlamasını iste."
)


def _get_attempt_instruction(attempt_count: int) -> str:
    """attempt_count değerine göre mentor yönlendirme talimatı döndürür."""
    return _ATTEMPT_HINTS.get(attempt_count, _ATTEMPT_HINT_DEFAULT)


# ---------------------------------------------------------------------------
# Kullanıcı mesajı oluşturma
# ---------------------------------------------------------------------------


def build_user_message(
    message: str,
    user_level: str,
    learning_path: str | None,
    attempt_count: int,
) -> str:
    """Bağlam bilgilerini kullanıcı mesajına ekler.

    Args:
        message: Kullanıcının ham sorusu.
        user_level: Kullanıcı seviyesi ("beginner", "intermediate", "advanced").
        learning_path: Öğrenme yolu ("python", "devops", "cloud", "iac").
        attempt_count: Kaçıncı deneme olduğu.

    Returns:
        Bağlam bilgileriyle zenginleştirilmiş mesaj.
    """
    parts = [f"Kullanıcı sorusu: {message}"]
    parts.append(f"Kullanıcı seviyesi: {user_level}")
    if learning_path:
        parts.append(f"Öğrenme yolu: {learning_path}")
    parts.append(f"Deneme sayısı: {attempt_count}")
    parts.append(_get_attempt_instruction(attempt_count))
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# OpenRouter HTTP çağrısı
# ---------------------------------------------------------------------------


async def call_llm(
    message: str,
    user_level: str = "beginner",
    learning_path: str | None = None,
    attempt_count: int = 1,
) -> tuple[str, str]:
    """OpenRouter API'ye httpx ile istek gönderir.

    Args:
        message: Kullanıcının sorusu (max 4000 karakter).
        user_level: Kullanıcı seviyesi.
        learning_path: Öğrenme yolu.
        attempt_count: Kaçıncı deneme.

    Returns:
        (answer, model_name) tuple'ı.

    Raises:
        ValueError: API key tanımlı değilse.
        RuntimeError: API çağrısı başarısız olursa.
    """
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY ortam değişkeni tanımlı değil. "
            "Lütfen .env dosyasına ekleyin."
        )

    model = settings.OPENROUTER_MODEL
    user_content = build_user_message(message, user_level, learning_path, attempt_count)

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": MENTOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "temperature": settings.OPENROUTER_TEMPERATURE,
        "max_tokens": settings.OPENROUTER_MAX_TOKENS,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.OPENROUTER_SITE_URL,
        "X-Title": settings.OPENROUTER_SITE_NAME,
    }

    try:
        async with httpx.AsyncClient(
            timeout=settings.OPENROUTER_TIMEOUT_SECONDS
        ) as client:
            response = await client.post(
                settings.OPENROUTER_CHAT_URL,
                json=payload,
                headers=headers,
            )

        if response.status_code == 401:
            # API key'i loglamıyoruz — sadece hata mesajı
            logger.error("OpenRouter 401: API key geçersiz veya yetkisiz.")
            raise RuntimeError("OpenRouter API key geçersiz veya yetkisiz.")

        if response.status_code == 429:
            logger.warning("OpenRouter 429: Rate limit aşıldı.")
            raise RuntimeError("OpenRouter rate limit aşıldı. Lütfen biraz bekleyin.")

        if response.status_code >= 500:
            logger.error("OpenRouter %d: Sunucu hatası.", response.status_code)
            raise RuntimeError(f"OpenRouter sunucu hatası: {response.status_code}")

        response.raise_for_status()

        data = response.json()
        answer: str = data["choices"][0]["message"]["content"]
        used_model: str = data.get("model", model)
        return answer, used_model

    except httpx.TimeoutException:
        logger.error("OpenRouter request timed out (%ss).", settings.OPENROUTER_TIMEOUT_SECONDS)
        raise RuntimeError(
            f"OpenRouter request timed out after {settings.OPENROUTER_TIMEOUT_SECONDS}s."
        )
    except httpx.NetworkError as exc:
        logger.error("OpenRouter network error: %s", exc)
        raise RuntimeError("OpenRouter'a baglanamadi. Ag baglantisinizi kontrol edin.")
    except (KeyError, IndexError) as exc:
        logger.error("OpenRouter unexpected response format: %s", exc)
        raise RuntimeError("OpenRouter'dan beklenmedik yanit formati alindi.")
