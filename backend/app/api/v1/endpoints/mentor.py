# Coderun backend — AI Mentor endpoint'leri; OpenRouter ile bağlam-duyarlı sohbet.

import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI

from app.api.v1.dependencies import get_current_active_user, get_openrouter
from app.core.config import settings
from app.core.rate_limiter import rate_limiter
from app.models.user import User
from app.schemas.mentor import MentorRequest, MentorResponse
from app.services.mentor_service import get_mentor_reply, get_mentor_reply_stream

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mentor", tags=["mentor"])


@router.post("/chat", response_model=MentorResponse)
async def chat_with_mentor(
    request: MentorRequest,
    current_user: User = Depends(get_current_active_user),
    client: AsyncOpenAI = Depends(get_openrouter),
) -> MentorResponse:
    """AI mentor ile sohbet.

    Rate limit: dakikada 20 istek/kullanıcı.

    Args:
        request: Mentor sohbet isteği.
        current_user: Kimliği doğrulanmış aktif kullanıcı.
        client: OpenRouter AsyncOpenAI istemcisi.

    Returns:
        Mentor yanıtı.

    Raises:
        HTTPException 429: Rate limit aşıldığında.
        HTTPException 503: API key geçersizse.
    """
    if not rate_limiter.is_allowed(str(current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla istek. 60 saniye sonra tekrar dene.",
            headers={"Retry-After": "60"},
        )

    try:
        reply = await get_mentor_reply(request, client)
        return MentorResponse(reply=reply, context=request.context)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        ) from e


@router.post("/chat/stream")
async def chat_with_mentor_stream(
    request: MentorRequest,
    current_user: User = Depends(get_current_active_user),
    client: AsyncOpenAI = Depends(get_openrouter),
) -> StreamingResponse:
    """Streaming AI mentor. SSE formatında yanıt döner.

    Args:
        request: Mentor sohbet isteği.
        current_user: Kimliği doğrulanmış aktif kullanıcı.
        client: OpenRouter AsyncOpenAI istemcisi.

    Returns:
        Server-Sent Events stream.

    Raises:
        HTTPException 429: Rate limit aşıldığında.
    """
    if not rate_limiter.is_allowed(str(current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla istek. Lütfen bekle.",
        )

    async def event_generator():
        try:
            async for chunk in get_mentor_reply_stream(request, client):
                data = json.dumps({"chunk": chunk, "is_done": False})
                yield f"data: {data}\n\n"
            yield f"data: {json.dumps({'chunk': '', 'is_done': True})}\n\n"
        except Exception as exc:
            logger.warning("Mentor stream hatası: %s", exc)
            yield f"data: {json.dumps({'chunk': 'Bir hata oluştu.', 'is_done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/status")
async def mentor_status(
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Mentor servis durumu ve kalan rate limit.

    Args:
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Servis durumu ve rate limit bilgisi.
    """
    remaining = rate_limiter.get_remaining(str(current_user.id))
    return {
        "status": "active",
        "model": settings.OPENROUTER_MODEL,
        "provider": "OpenRouter",
        "rate_limit_remaining": remaining,
    }
