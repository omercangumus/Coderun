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
from app.schemas.llm_mentor import LlmMentorRequest, LlmMentorResponse
from app.schemas.mentor import MentorRequest, MentorResponse
from app.services.llm_service import call_llm
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
        "provider": "AI",
        "rate_limit_remaining": remaining,
    }


@router.post(
    "/ask",
    response_model=LlmMentorResponse,
    summary="LLM Mentor — httpx tabanlı, attempt_count destekli",
)
async def ask_mentor(
    request: LlmMentorRequest,
    current_user: User = Depends(get_current_active_user),
) -> LlmMentorResponse:
    """Öğrenme bağlamına duyarlı AI mentor sorusu.

    attempt_count değerine göre mentor davranışı değişir:
    - 1: Sadece küçük ipucu
    - 2: Daha açık ipucu
    - 3+: Mantığı açıklayan küçük örnek

    Rate limit: dakikada 20 istek/kullanıcı.

    Args:
        request: LLM mentor isteği (message, user_level, learning_path, attempt_count).
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Mentor yanıtı ve kullanılan model adı.

    Raises:
        HTTPException 429: Rate limit aşıldığında.
        HTTPException 503: API key eksik veya OpenRouter erişilemez.
    """
    if not rate_limiter.is_allowed(str(current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla istek. 60 saniye sonra tekrar dene.",
            headers={"Retry-After": "60"},
        )

    try:
        answer, _model_name = await call_llm(
            message=request.message,
            user_level=request.user_level,
            learning_path=request.learning_path,
            attempt_count=request.attempt_count,
        )
        return LlmMentorResponse(answer=answer)

    except ValueError as exc:
        # API key eksik — yapılandırma hatası
        logger.error("LLM servis yapılandırma hatası: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Mentor şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
        ) from exc

    except RuntimeError as exc:
        # Timeout, network, rate limit, sunucu hatası
        error_msg = str(exc)
        if "rate limit" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI servis rate limit aşıldı. Lütfen biraz bekleyin.",
                headers={"Retry-After": "30"},
            ) from exc
        logger.error("LLM servis çalışma hatası: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Mentor şu an yanıt veremiyor. Lütfen tekrar deneyin.",
        ) from exc
