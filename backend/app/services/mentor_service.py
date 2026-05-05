# Coderun backend — AI Mentor servisi; OpenRouter ile bağlam-duyarlı yanıtlar.

import re
from typing import AsyncGenerator

from openai import AsyncOpenAI

from app.core.config import settings
from app.schemas.mentor import ChatMessage, MentorRequest

# ---------------------------------------------------------------------------
# System prompt bileşenleri
# ---------------------------------------------------------------------------

BASE_SYSTEM_PROMPT = """Sen Coderun platformunun yapay zeka mentörüsün. Adın Phantom. 👻

Görevin:
- Kullanıcıların Python, DevOps ve Cloud konularında öğrenmelerine yardım etmek
- ASLA doğrudan cevabı vermemek, bunun yerine yönlendirici ipuçları sunmak
- Kullanıcıyı düşündürmek ve kendisinin çözmesini sağlamak

Yanıt kuralları:
1. Her zaman Türkçe yanıt ver
2. Maksimum 3-4 cümle yaz, kısa ve öz ol
3. Soru sorarak yönlendir
4. "Şunu dene:" veya "Bir ipucu:" gibi ifadeler kullan
5. Kod verirken eksik bırak, kullanıcının tamamlamasını iste
6. Asla "İşte cevap:" deme
7. Samimi ve teşvik edici ol
"""

PYTHON_CONTEXT = """
Şu an kullanıcı Python öğreniyor.
Temel konular: değişkenler, veri tipleri, döngüler, fonksiyonlar, OOP.
Python sözdizimi ve indentation hatalarına dikkat et.
"""

DEVOPS_CONTEXT = """
Şu an kullanıcı DevOps öğreniyor.
Temel konular: Linux, Bash, Docker, GitHub Actions, CI/CD pipeline.
Terminal komutlarını ve hata mesajlarını doğru yorumlamasına yardım et.
"""

CLOUD_CONTEXT = """
Şu an kullanıcı Cloud öğreniyor.
Temel konular: AWS EC2, S3, RDS, IAM, temel bulut mimarisi.
AWS servislerini doğru kullanmaya ve güvenliğe dikkat çek.
"""

LAB_CONTEXT = """
Kullanıcı şu an lab ortamında çalışıyor.
Terminal komutları yazıyor veya kod geliştiriyor olabilir.
Komutun ne yaptığını anlamasına yardımcı ol, komutu direkt verme.
"""

# Prompt injection için tehlikeli karakter/ifade desenleri
_INJECTION_PATTERN = re.compile(
    r"(ignore previous|system prompt|you are now|forget your|<\|.*?\|>)",
    re.IGNORECASE,
)


def _sanitize(text: str) -> str:
    """Kullanıcı girdisindeki prompt injection girişimlerini temizler."""
    # Tehlikeli kalıpları maskele
    sanitized = _INJECTION_PATTERN.sub("[FILTERED]", text)
    # Özel karakterleri escape et
    return sanitized.replace("\\", "\\\\").replace("`", "\\`")


# ---------------------------------------------------------------------------
# Pure functions
# ---------------------------------------------------------------------------


def build_system_prompt(
    context: str,
    module_slug: str | None,
    lesson_title: str | None,
    question_text: str | None,
) -> str:
    """Bağlama göre sistem promptu oluşturur. Pure function.

    Args:
        context: Mentor bağlamı ("lesson", "lab", "general").
        module_slug: Modül kimliği ("python", "devops", "cloud").
        lesson_title: Aktif ders başlığı.
        question_text: Kullanıcının takıldığı soru metni.

    Returns:
        Birleştirilmiş sistem promptu.
    """
    prompt = BASE_SYSTEM_PROMPT

    if module_slug == "python":
        prompt += PYTHON_CONTEXT
    elif module_slug == "devops":
        prompt += DEVOPS_CONTEXT
    elif module_slug == "cloud":
        prompt += CLOUD_CONTEXT

    if context == "lab":
        prompt += LAB_CONTEXT

    if lesson_title:
        safe_title = _sanitize(lesson_title)
        prompt += f"\nKullanıcı şu an '{safe_title}' dersinde çalışıyor."

    if question_text:
        safe_question = _sanitize(question_text)
        prompt += f"\nKullanıcının takıldığı soru: '{safe_question}'"

    return prompt


def build_messages(
    system_prompt: str,
    history: list[ChatMessage],
    new_message: str,
) -> list[dict]:
    """OpenRouter API için mesaj listesi oluşturur. Pure function.

    Args:
        system_prompt: Sistem promptu.
        history: Önceki sohbet geçmişi.
        new_message: Kullanıcının yeni mesajı.

    Returns:
        OpenRouter API formatında mesaj listesi.
    """
    messages: list[dict] = [{"role": "system", "content": system_prompt}]

    # Geçmiş mesajları ekle (max MENTOR_MAX_HISTORY kadar)
    for msg in history[-settings.MENTOR_MAX_HISTORY :]:
        messages.append({"role": msg.role, "content": msg.content})

    # Yeni mesajı ekle (sanitize edilmiş)
    messages.append({"role": "user", "content": _sanitize(new_message)})

    return messages


# ---------------------------------------------------------------------------
# API çağrıları
# ---------------------------------------------------------------------------


async def get_mentor_reply(
    request: MentorRequest,
    client: AsyncOpenAI,
) -> str:
    """OpenRouter API'den mentor yanıtı alır.

    Args:
        request: Mentor isteği.
        client: AsyncOpenAI istemcisi.

    Returns:
        Mentor yanıt metni.

    Raises:
        ValueError: API key geçersizse.
    """
    system_prompt = build_system_prompt(
        context=request.context,
        module_slug=request.module_slug,
        lesson_title=request.lesson_title,
        question_text=request.question_text,
    )
    messages = build_messages(system_prompt, request.history, request.message)

    try:
        completion = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=messages,
            max_tokens=settings.OPENROUTER_MAX_TOKENS,
            temperature=settings.OPENROUTER_TEMPERATURE,
        )
        content = completion.choices[0].message.content
        return content or "Bir hata oluştu, tekrar dene."

    except Exception as e:
        error_str = str(e).lower()
        if "rate_limit" in error_str or "429" in error_str:
            return "Çok fazla istek gönderildi, lütfen biraz bekle. ⏳"
        elif "invalid_api_key" in error_str or "401" in error_str:
            raise ValueError("OpenRouter API key geçersiz") from e
        elif "context_length" in error_str:
            return "Mesaj çok uzun, lütfen daha kısa yaz."
        else:
            raise


async def get_mentor_reply_stream(
    request: MentorRequest,
    client: AsyncOpenAI,
) -> AsyncGenerator[str, None]:
    """OpenRouter API'den streaming yanıt alır.

    Args:
        request: Mentor isteği.
        client: AsyncOpenAI istemcisi.

    Yields:
        Yanıt metin parçaları.
    """
    system_prompt = build_system_prompt(
        context=request.context,
        module_slug=request.module_slug,
        lesson_title=request.lesson_title,
        question_text=request.question_text,
    )
    messages = build_messages(system_prompt, request.history, request.message)

    stream = await client.chat.completions.create(
        model=settings.OPENROUTER_MODEL,
        messages=messages,
        max_tokens=settings.OPENROUTER_MAX_TOKENS,
        temperature=settings.OPENROUTER_TEMPERATURE,
        stream=True,
    )

    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
