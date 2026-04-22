# Coderun backend — seviye testi servis katmanı; akıllı yerleştirme algoritmasını yönetir.

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status

from app.core.config import settings
from app.repositories.lesson_repository import LessonRepository
from app.repositories.module_repository import ModuleRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.question_repository import QuestionRepository
from app.schemas.progress import (
    AnswerSubmit,
    PlacementResultResponse,
    PlacementTestResponse,
)
from app.schemas.question import QuestionResponse


def calculate_placement(
    correct_count: int,
    total_count: int,
    total_lessons: int,
) -> tuple[int, int]:
    """Seviye testi sonucuna göre başlangıç dersini hesaplar.

    Pure function — test edilebilir, yan etkisi yoktur.

    Algoritma:
        - %0–30  → 1. dersten başla (tam başlangıç)
        - %31–60 → modülün ortasından başla
        - %61–80 → modülün son çeyreğinden başla
        - %81–100 → tüm modülü tamamlanmış say (başlangıç = total_lessons + 1)

    Args:
        correct_count: Doğru cevap sayısı.
        total_count: Toplam soru sayısı.
        total_lessons: Modüldeki toplam ders sayısı.

    Returns:
        (starting_lesson_order, skipped_lessons) tuple'ı.
    """
    if total_count == 0:
        return 1, 0

    ratio = correct_count / total_count

    if ratio <= settings.PLACEMENT_BEGINNER_MAX:
        starting_order = 1
    elif ratio <= settings.PLACEMENT_INTERMEDIATE_MAX:
        starting_order = max(1, total_lessons // 2)
    elif ratio <= settings.PLACEMENT_ADVANCED_MAX:
        starting_order = max(1, (total_lessons * 3) // 4)
    else:
        # Tüm modülü tamamlanmış say
        starting_order = total_lessons + 1

    skipped_lessons = max(0, starting_order - 1)
    return starting_order, skipped_lessons


async def get_placement_questions(
    module_slug: str,
    module_repo: ModuleRepository,
    question_repo: QuestionRepository,
) -> PlacementTestResponse:
    """Seviye testi için modülden rastgele sorular getirir.

    Args:
        module_slug: Modülün slug değeri.
        module_repo: Modül repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.

    Returns:
        Soru listesi (correct_answer içermez) ve modül bilgisi.

    Raises:
        HTTPException: Modül bulunamazsa 404 döner.
    """
    module = await module_repo.get_by_slug(module_slug)
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )

    questions = await question_repo.get_random_by_module(
        module.id,
        limit=settings.PLACEMENT_QUESTION_COUNT,
    )

    return PlacementTestResponse(
        module_id=module.id,
        module_title=module.title,
        questions=[QuestionResponse.model_validate(q) for q in questions],
        total_questions=len(questions),
    )


async def submit_placement_test(
    module_slug: str,
    user_id: UUID,
    answers: list[AnswerSubmit],
    module_repo: ModuleRepository,
    question_repo: QuestionRepository,
    progress_repo: ProgressRepository,
    lesson_repo: LessonRepository,
) -> PlacementResultResponse:
    """Seviye testi cevaplarını değerlendirir ve kullanıcıyı yerleştirir.

    Belirlenen başlangıç dersine kadar olan tüm dersleri otomatik tamamlar.

    Args:
        module_slug: Modülün slug değeri.
        user_id: Kullanıcının UUID'si.
        answers: Kullanıcının cevap listesi.
        module_repo: Modül repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        lesson_repo: Ders repository bağımlılığı.

    Returns:
        Doğru sayısı, yüzde, başlangıç dersi ve atlanan ders bilgisi.

    Raises:
        HTTPException: Modül bulunamazsa 404 döner.
    """
    module = await module_repo.get_by_slug(module_slug)
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )

    # Cevaplanan soruları doğrula
    answer_map = {a.question_id: a.answer for a in answers}
    question_ids = list(answer_map.keys())

    # N+1 sorguyu önlemek için tüm soruları tek sorguda çek
    questions = await question_repo.get_by_ids(question_ids)
    question_map = {q.id: q for q in questions}

    correct_count = 0
    for question_id, user_answer in answer_map.items():
        question = question_map.get(question_id)
        if question is not None:
            if user_answer.strip().lower() == question.correct_answer.strip().lower():
                correct_count += 1

    total_count = len(answers)
    percentage = (correct_count / total_count * 100) if total_count > 0 else 0.0

    # Modüldeki toplam ders sayısını lesson_repo üzerinden al
    total_lessons = await lesson_repo.count_by_module(module.id)

    starting_order, skipped_lessons = calculate_placement(
        correct_count, total_count, total_lessons
    )

    # Başlangıç dersine kadar olan dersleri otomatik tamamla
    if skipped_lessons > 0:
        lessons_to_complete = await lesson_repo.get_by_module(module.id)
        lessons_to_complete = [lesson for lesson in lessons_to_complete if lesson.order < starting_order]
        now = datetime.now(timezone.utc)

        for lesson in lessons_to_complete:
            existing = await progress_repo.get_user_lesson_progress(user_id, lesson.id)
            if existing is None:
                await progress_repo.create({
                    "user_id": user_id,
                    "lesson_id": lesson.id,
                    "is_completed": True,
                    "score": 100,
                    "attempt_count": 1,
                    "completed_at": now,
                })

    # Mesaj oluştur
    if starting_order > total_lessons:
        message = f"Harika! Tüm {module.title} modülünü tamamladınız sayılırsınız. Bir sonraki modüle geçebilirsiniz."
    elif skipped_lessons == 0:
        message = "1. dersten başlıyorsunuz. Başarılar!"
    else:
        message = f"{starting_order}. dersten başlıyorsunuz. {skipped_lessons} ders atlandı."

    return PlacementResultResponse(
        correct_count=correct_count,
        total_count=total_count,
        percentage=round(percentage, 2),
        starting_lesson_order=starting_order,
        skipped_lessons=skipped_lessons,
        message=message,
    )
