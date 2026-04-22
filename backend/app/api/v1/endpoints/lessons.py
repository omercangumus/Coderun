# Coderun backend — ders endpoint'leri; ders listeleme, detay ve cevap gönderme API'leri.

from uuid import UUID

from fastapi import APIRouter, Depends
from redis.asyncio import Redis

from app.api.v1.dependencies import (
    get_badge_repository,
    get_current_active_user,
    get_lesson_repository,
    get_module_repository,
    get_progress_repository,
    get_question_repository,
    get_redis,
    get_user_repository,
)
from app.models.user import User
from app.repositories.badge_repository import BadgeRepository
from app.repositories.lesson_repository import LessonRepository
from app.repositories.module_repository import ModuleRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.user_repository import UserRepository
from app.schemas.lesson import (
    LessonDetailResponse,
    LessonResultResponse,
    LessonWithProgressResponse,
)
from app.schemas.progress import AnswerSubmit
from app.services import lesson_service

router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.get("/module/{module_slug}", response_model=list[LessonWithProgressResponse])
async def list_lessons_by_module(
    module_slug: str,
    lesson_repo: LessonRepository = Depends(get_lesson_repository),
    progress_repo: ProgressRepository = Depends(get_progress_repository),
    module_repo: ModuleRepository = Depends(get_module_repository),
    current_user: User = Depends(get_current_active_user),
) -> list[LessonWithProgressResponse]:
    """Modüle ait dersleri kullanıcının ilerleme bilgisiyle listeler.

    Auth gerekir. İlk ders açık, sonrakiler önceki tamamlanmadan kilitlidir.
    Mobile app slug gönderiyor, bu yüzden slug ile module bulup dersleri getiriyoruz.

    Args:
        module_slug: Modülün slug'ı (örn: "python", "devops", "cloud").
        lesson_repo: Ders repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        module_repo: Modül repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        İlerleme bilgisi eklenmiş ders listesi.
    """
    return await lesson_service.get_lessons_by_module_slug(
        module_slug, current_user.id, module_repo, lesson_repo, progress_repo
    )


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson(
    lesson_id: UUID,
    lesson_repo: LessonRepository = Depends(get_lesson_repository),
    current_user: User = Depends(get_current_active_user),
) -> LessonDetailResponse:
    """Ders detayını soruları ile birlikte getirir.

    Auth gerekir. correct_answer response'a dahil edilmez.

    Args:
        lesson_id: Dersin UUID'si.
        lesson_repo: Ders repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Soruları dahil ders detay bilgisi.
    """
    return await lesson_service.get_lesson_detail(lesson_id, lesson_repo)


@router.post("/{lesson_id}/submit", response_model=LessonResultResponse)
async def submit_lesson(
    lesson_id: UUID,
    answers: list[AnswerSubmit],
    lesson_repo: LessonRepository = Depends(get_lesson_repository),
    question_repo: QuestionRepository = Depends(get_question_repository),
    progress_repo: ProgressRepository = Depends(get_progress_repository),
    user_repo: UserRepository = Depends(get_user_repository),
    badge_repo: BadgeRepository = Depends(get_badge_repository),
    redis: Redis | None = Depends(get_redis),
    current_user: User = Depends(get_current_active_user),
) -> LessonResultResponse:
    """Ders cevaplarını gönderir, gamification uygular ve sonucu döner.

    Auth gerekir. Skor >= 70 ise ders tamamlandı sayılır, XP ve rozetler verilir.

    Args:
        lesson_id: Cevaplanan dersin UUID'si.
        answers: Kullanıcının cevap listesi.
        lesson_repo: Ders repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        user_repo: Kullanıcı repository bağımlılığı.
        badge_repo: Rozet repository bağımlılığı.
        redis: Redis client (liderboard için).
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Skor, XP, seviye, streak ve rozet bilgisi.
    """
    return await lesson_service.submit_lesson_answer(
        lesson_id,
        current_user.id,
        answers,
        lesson_repo,
        question_repo,
        progress_repo,
        user_repo,
        badge_repo,
        redis,
    )
