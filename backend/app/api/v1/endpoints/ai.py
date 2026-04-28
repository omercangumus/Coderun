# Coderun backend — AI Mentor endpoint'i; Groq LLM ile lab yardımcısı.

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.v1.dependencies import get_current_active_user
from app.core.config import settings
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])


class AiMentorRequest(BaseModel):
    """AI Mentor sohbet isteği."""
    message: str
    lesson_context: str | None = None


class AiMentorResponse(BaseModel):
    """AI Mentor sohbet yanıtı."""
    reply: str


@router.post("/mentor", response_model=AiMentorResponse)
async def ai_mentor_chat(
    payload: AiMentorRequest,
    current_user: User = Depends(get_current_active_user),
) -> AiMentorResponse:
    """Groq AI ile lab ortamı yardımcısı.

    Auth gerekir. GROQ_API_KEY yoksa fallback mesaj döner.

    Args:
        payload: Kullanıcı mesajı ve opsiyonel ders bağlamı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        AI yanıtı.
    """
    if not settings.GROQ_API_KEY:
        return AiMentorResponse(
            reply="AI Mentor şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin."
        )

    try:
        from groq import AsyncGroq  # type: ignore[import-untyped]

        client = AsyncGroq(api_key=settings.GROQ_API_KEY)

        system_prompt = (
            "Sen Coderun platformunun AI Mentor'usun (Phantom). "
            "Kullanıcılara DevOps, Python ve Cloud konularında lab ortamında yardım ediyorsun. "
            "Türkçe yanıt ver. Kısa, net ve yönlendirici ol. "
            "Doğrudan cevap verme — ipucu ver ve kullanıcının kendisi bulsun. "
            "Kod örnekleri için markdown kullan."
        )

        if payload.lesson_context:
            system_prompt += f"\n\nMevcut ders bağlamı: {payload.lesson_context}"

        completion = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.message},
            ],
            max_tokens=512,
            temperature=0.7,
        )

        reply = completion.choices[0].message.content or "Bir yanıt oluşturulamadı."
        return AiMentorResponse(reply=reply)

    except Exception as exc:
        logger.warning("AI Mentor hatası: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Mentor şu an kullanılamıyor.",
        ) from exc
