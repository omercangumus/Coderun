# Coderun backend — code runner endpoint'leri.
# POST /api/v1/code/run  — sandbox'ta kod çalıştır
# POST /api/v1/code/submit — ödev test senaryolarına karşı değerlendir

from __future__ import annotations

import logging
import uuid as _uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies import get_current_active_user, get_db
from app.models.question import Question
from app.models.user import User
from app.schemas.code_runner import (
    CodeRunRequest,
    CodeRunResponse,
    CodeSubmitRequest,
    CodeSubmitResponse,
)
from app.services import code_runner_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/code", tags=["code-runner"])


@router.post("/run", response_model=CodeRunResponse)
async def run_code_endpoint(
    request: CodeRunRequest,
    current_user: User = Depends(get_current_active_user),
) -> CodeRunResponse:
    """Kodu Docker sandbox içinde güvenli biçimde çalıştırır.

    Auth gerekir. Sadece Python desteklenir.
    Docker yoksa 503 döner — host'ta doğrudan çalıştırma yapılmaz.

    Args:
        request: Dil, kod, stdin ve limit parametreleri.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        stdout, stderr, exit_code, duration_ms, timed_out.
    """
    logger.info(
        "code_run_request: user_id=%s language=%s code_len=%d",
        current_user.id,
        request.language,
        len(request.code),
    )
    return await code_runner_service.run_code(
        language=request.language,
        code=request.code,
        stdin=request.stdin,
        timeout_ms=request.timeout_ms,
        memory_mb=request.memory_limit_mb,
    )


@router.post("/submit", response_model=CodeSubmitResponse)
async def submit_code_endpoint(
    request: CodeSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> CodeSubmitResponse:
    """Kodu ödev test senaryolarına karşı değerlendirir.

    Auth gerekir. Soru code_editor tipinde olmalı ve test senaryoları içermeli.
    Gizli test senaryolarının expected_stdout değeri response'a dahil edilmez.

    Args:
        request: question_id, kod ve dil.
        current_user: Kimliği doğrulanmış aktif kullanıcı.
        db: Veritabanı oturumu.

    Returns:
        passed, score, test_results (gizli testler korumalı), feedback.
    """
    # Soruyu getir
    try:
        question_uuid = _uuid.UUID(request.question_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Geçersiz question_id formatı.",
        )

    result = await db.execute(
        select(Question).where(Question.id == question_uuid)
    )
    question = result.scalar_one_or_none()

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Soru bulunamadı.",
        )

    if question.question_type != "code_editor":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Bu soru bir kod ödevi değil.",
        )

    if not question.test_cases:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Bu ödev için test senaryosu yapılandırılmamış.",
        )

    logger.info(
        "code_submit_request: user_id=%s question_id=%s language=%s code_len=%d",
        current_user.id,
        request.question_id,
        request.language,
        len(request.code),
    )

    return await code_runner_service.evaluate_submission(
        question=question,
        code=request.code,
        language=request.language,
    )
