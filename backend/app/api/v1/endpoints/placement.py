# Coderun backend — seviye testi endpoint'leri; akıllı yerleştirme API'leri.

from fastapi import APIRouter, Depends

from backend.app.api.v1.dependencies import (
    get_current_active_user,
    get_lesson_repository,
    get_module_repository,
    get_progress_repository,
    get_question_repository,
)
from backend.app.models.user import User
from backend.app.repositories.lesson_repository import LessonRepository
from backend.app.repositories.module_repository import ModuleRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.repositories.question_repository import QuestionRepository
from backend.app.schemas.progress import (
    AnswerSubmit,
    PlacementResultResponse,
    PlacementTestResponse,
)
from backend.app.services import placement_service

router = APIRouter(prefix="/placement", tags=["placement"])


@router.get("/{module_slug}", response_model=PlacementTestResponse)
async def get_placement_test(
    module_slug: str,
    module_repo: ModuleRepository = Depends(get_module_repository),
    question_repo: QuestionRepository = Depends(get_question_repository),
    current_user: User = Depends(get_current_active_user),
) -> PlacementTestResponse:
    """Seviye testi için modülden rastgele sorular getirir.

    Auth gerekir. 15 rastgele soru döner, correct_answer içermez.

    Args:
        module_slug: Modülün slug değeri.
        module_repo: Modül repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Soru listesi ve modül bilgisi.
    """
    return await placement_service.get_placement_questions(
        module_slug, module_repo, question_repo
    )


@router.post("/{module_slug}/submit", response_model=PlacementResultResponse)
async def submit_placement_test(
    module_slug: str,
    answers: list[AnswerSubmit],
    module_repo: ModuleRepository = Depends(get_module_repository),
    question_repo: QuestionRepository = Depends(get_question_repository),
    progress_repo: ProgressRepository = Depends(get_progress_repository),
    lesson_repo: LessonRepository = Depends(get_lesson_repository),
    current_user: User = Depends(get_current_active_user),
) -> PlacementResultResponse:
    """Seviye testi cevaplarını değerlendirir ve kullanıcıyı yerleştirir.

    Auth gerekir. Sonuca göre önceki dersler otomatik tamamlanır.

    Args:
        module_slug: Modülün slug değeri.
        answers: Kullanıcının cevap listesi.
        module_repo: Modül repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        lesson_repo: Ders repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Doğru sayısı, yüzde, başlangıç dersi ve atlanan ders bilgisi.
    """
    return await placement_service.submit_placement_test(
        module_slug,
        current_user.id,
        answers,
        module_repo,
        question_repo,
        progress_repo,
        lesson_repo,
    )
