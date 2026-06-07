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

MENTOR_SYSTEM_PROMPT = """Sen Coderun platformunda çalışan Ghostie adlı bir AI mentorsun.
Coderun; Python, DevOps, Cloud ve Infrastructure as Code öğrenme yolları sunan bir eğitim platformudur.
Görevin kullanıcıya doğrudan sınav cevabını vermek değil, onunla kısa bir diyalog kurarak öğrenmesini sağlamaktır.

Genel kurallar:
- Türkçe, samimi ve öğretici konuş.
- Önce kullanıcının neyi anlamadığını anlamaya çalış; tek cümlelik sorular sor.
- Kullanıcıyla tartış: "Şunu düşün...", "Önce şu kavramı hatırla..." gibi yönlendir.
- Final cevabı (doğru şık, boşluktaki tam kelime) hemen verme.
- İpucu → biraz daha açık ipucu → benzer mini örnek sırasını izle.
- Python'da sade anlat; gereksiz akademik dil kullanma.

Quiz / çoktan seçmeli:
- Doğru şıkkın harfini veya metnini ASLA söyleme.
- Yanlış seçenekleri eleyebilirsin ama doğruyu işaret etme.

Kod tamamlama:
- Önce boşluğun ne tür bir ifade beklediğini (fonksiyon, operatör, sayı vb.) açıkla.
- Çok zorlanırsa benzer ama farklı mini kod örneği göster; asıl sorunun cevabını kopyalama.
- Sadece kullanıcı 4+ kez yardım istediyse ve kod tamamlama sorusundaysa, yanıtının SON satırında
  tam olarak şu formatta öneri verebilirsin: ÖNERİ: <sadece_boşluğa_yazılacak_metin>
  Bu satırdan önce mutlaka kısa açıklama yap."""

# ---------------------------------------------------------------------------
# Attempt count'a göre yönlendirme talimatları
# ---------------------------------------------------------------------------

_ATTEMPT_HINTS: dict[int, str] = {
    1: (
        "Kullanıcı ilk kez yardım istiyor. Soruyu yeniden özetleme; "
        "hangi kavrama odaklanması gerektiğini söyle ve tek küçük ipucu ver. Cevabı verme."
    ),
    2: (
        "Kullanıcı ikinci kez soruyor. Bir adım daha açık anlat, "
        "belki bir karşı-örnek veya yanlış yaklaşımı düzelt. Yine de final cevabı verme."
    ),
    3: (
        "Kullanıcı üçüncü kez takıldı. Mantığı adım adım anlat ve "
        "asıl sorudan farklı küçük bir örnek göster. Kullanıcıdan kendi cevabını denemesini iste."
    ),
}
_ATTEMPT_HINT_DEFAULT = (
    "Kullanıcı defalarca yardım istedi. Önce kısa tartışma yap; "
    "kod tamamlama sorusundaysa ve hâlâ takılıysa son satırda ÖNERİ: formatında "
    "sadece boşluğa yazılacak parçayı önerebilirsin. Çoktan seçmelide doğru şıkkı verme."
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
    *,
    question_text: str | None = None,
    lesson_title: str | None = None,
    question_type: str | None = None,
    code_block: str | None = None,
) -> str:
    """Bağlam bilgilerini kullanıcı mesajına ekler.

    Args:
        message: Kullanıcının ham sorusu.
        user_level: Kullanıcı seviyesi ("beginner", "intermediate", "advanced").
        learning_path: Öğrenme yolu ("python", "devops", "cloud", "iac").
        attempt_count: Kaçıncı deneme olduğu.
        question_text: Aktif quiz sorusunun metni.
        lesson_title: Ders başlığı.
        question_type: Soru tipi.
        code_block: Kod tamamlama bloğu.

    Returns:
        Bağlam bilgileriyle zenginleştirilmiş mesaj.
    """
    parts = [f"Kullanıcı mesajı: {message}"]
    parts.append(f"Kullanıcı seviyesi: {user_level}")
    if learning_path:
        parts.append(f"Öğrenme yolu: {learning_path}")
    if lesson_title:
        parts.append(f"Ders: {lesson_title}")
    if question_type:
        parts.append(f"Soru tipi: {question_type}")
    if question_text:
        parts.append(f"Aktif soru metni:\n{question_text}")
    if code_block:
        parts.append(f"Kod bloğu (___ boşlukları doldurulacak):\n{code_block}")
    parts.append(f"Mentor etkileşim sayısı (attempt_count): {attempt_count}")
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
    *,
    question_text: str | None = None,
    lesson_title: str | None = None,
    question_type: str | None = None,
    code_block: str | None = None,
) -> tuple[str, str]:
    """OpenRouter API'ye httpx ile istek gönderir.

    Args:
        message: Kullanıcının sorusu (max 4000 karakter).
        user_level: Kullanıcı seviyesi.
        learning_path: Öğrenme yolu.
        attempt_count: Kaçıncı deneme.
        question_text: Aktif quiz sorusu.
        lesson_title: Ders başlığı.
        question_type: Soru tipi.
        code_block: Kod bloğu.

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
    user_content = build_user_message(
        message,
        user_level,
        learning_path,
        attempt_count,
        question_text=question_text,
        lesson_title=lesson_title,
        question_type=question_type,
        code_block=code_block,
    )

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
