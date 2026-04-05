# Coderun backend — ders servis katmanı; ders iş mantığını, cevap değerlendirmesini ve gamification'ı yönetir.

from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import HTTPException, status
from redis.asyncio import Redis

from backend.app.core.config import settings
from backend.app.repositories.badge_repository import BadgeRepository
from backend.app.repositories.lesson_repository import LessonRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.repositories.question_repository import QuestionRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.gamification import BadgeResponse
from backend.app.schemas.lesson import (
    LessonDetailResponse,
    LessonResultResponse,
    LessonWithProgressResponse,
)
from backend.app.schemas.progress import AnswerSubmit
from backend.app.services import gamification_service
from backend.app.services.leaderboard_service import add_xp_to_leaderboard


async def get_lessons_by_module(
    module_id: UUID,
    user_id: UUID,
    lesson_repo: LessonRepository,
    progress_repo: ProgressRepository,
) -> list[LessonWithProgressResponse]:
    """Modüle ait dersleri kullanıcının ilerleme bilgisiyle birlikte döner.

    İlk ders her zaman açık, sonraki dersler önceki ders tamamlanmadan kilitlidir.

    Args:
        module_id: Modülün UUID'si.
        user_id: Kullanıcının UUID'si.
        lesson_repo: Ders repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.

    Returns:
        İlerleme bilgisi eklenmiş ders listesi.
    """
    lessons = await lesson_repo.get_by_module(module_id)
    progress_list = await progress_repo.get_user_module_progress(user_id, module_id)
    progress_map = {p.lesson_id: p for p in progress_list}

    result: list[LessonWithProgressResponse] = []
    previous_completed = True

    for lesson in lessons:
        progress = progress_map.get(lesson.id)
        is_completed = progress.is_completed if progress else False
        is_locked = not previous_completed

        result.append(
            LessonWithProgressResponse(
                id=lesson.id,
                module_id=lesson.module_id,
                title=lesson.title,
                lesson_type=lesson.lesson_type,
                order=lesson.order,
                xp_reward=lesson.xp_reward,
                is_active=lesson.is_active,
                is_completed=is_completed,
                is_locked=is_locked,
                score=progress.score if progress else None,
                attempt_count=progress.attempt_count if progress else 0,
            )
        )
        previous_completed = is_completed

    return result


async def get_lesson_detail(
    lesson_id: UUID,
    lesson_repo: LessonRepository,
) -> LessonDetailResponse:
    """Dersi soruları ile birlikte getirir.

    Args:
        lesson_id: Dersin UUID'si.
        lesson_repo: Ders repository bağımlılığı.

    Returns:
        Soruları dahil ders detay bilgisi (correct_answer içermez).

    Raises:
        HTTPException: Ders bulunamazsa 404 döner.
    """
    lesson = await lesson_repo.get_with_questions(lesson_id)
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ders bulunamadı",
        )
    return LessonDetailResponse.model_validate(lesson)


async def _check_module_completed(
    module_id: UUID,
    user_id: UUID,
    progress_repo: ProgressRepository,
) -> bool:
    """Kullanıcının bir modüldeki tüm dersleri tamamlayıp tamamlamadığını kontrol eder.

    Args:
        module_id: Modülün UUID'si.
        user_id: Kullanıcının UUID'si.
        progress_repo: İlerleme repository bağımlılığı.

    Returns:
        Tüm dersler tamamlandıysa True.
    """
    rate = await progress_repo.get_module_completion_rate(user_id, module_id)
    return rate >= 1.0


async def submit_lesson_answer(
    lesson_id: UUID,
    user_id: UUID,
    answers: list[AnswerSubmit],
    lesson_repo: LessonRepository,
    question_repo: QuestionRepository,
    progress_repo: ProgressRepository,
    user_repo: UserRepository,
    badge_repo: BadgeRepository,
    redis: Redis | None = None,
) -> LessonResultResponse:
    """Ders cevaplarını değerlendirir, ilerlemeyi günceller ve gamification uygular.

    Skor = (doğru sayısı / toplam soru) * 100.
    Skor >= LESSON_PASS_SCORE ise ders tamamlandı sayılır.
    Tamamlandıysa gamification_service.award_xp_and_update_streak() çağrılır.

    Args:
        lesson_id: Cevaplanan dersin UUID'si.
        user_id: Kullanıcının UUID'si.
        answers: Kullanıcının cevap listesi.
        lesson_repo: Ders repository bağımlılığı.
        question_repo: Soru repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        user_repo: Kullanıcı repository bağımlılığı.
        badge_repo: Rozet repository bağımlılığı.
        redis: Redis client (liderboard için, opsiyonel).

    Returns:
        Skor, doğru/yanlış sayısı, kazanılan XP, seviye ve rozet bilgisi.

    Raises:
        HTTPException: Ders bulunamazsa 404 döner.
    """
    lesson = await lesson_repo.get_by_id(lesson_id)
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ders bulunamadı",
        )

    questions = await question_repo.get_by_lesson(lesson_id)
    answer_map = {a.question_id: a.answer for a in answers}

    correct_count = 0
    for question in questions:
        user_answer = answer_map.get(question.id, "")
        if user_answer.strip().lower() == question.correct_answer.strip().lower():
            correct_count += 1

    total_questions = len(questions)
    wrong_count = total_questions - correct_count
    score = int((correct_count / total_questions) * 100) if total_questions > 0 else 0
    is_completed = score >= settings.LESSON_PASS_SCORE

    # İlerleme kaydını güncelle veya oluştur
    existing_progress = await progress_repo.get_user_lesson_progress(user_id, lesson_id)
    now = datetime.now(timezone.utc)

    if existing_progress is None:
        await progress_repo.create({
            "user_id": user_id,
            "lesson_id": lesson_id,
            "is_completed": is_completed,
            "score": score,
            "attempt_count": 1,
            "completed_at": now if is_completed else None,
        })
    else:
        update_data: dict = {
            "attempt_count": existing_progress.attempt_count + 1,
            "score": max(existing_progress.score, score),
        }
        if is_completed and not existing_progress.is_completed:
            update_data["is_completed"] = True
            update_data["completed_at"] = now
        await progress_repo.update(existing_progress.id, update_data)

    # Gamification — sadece ders tamamlandıysa
    xp_result = None
    level_up = False
    new_level = 1
    new_streak = 0
    badges_earned: list[BadgeResponse] = []

    if is_completed:
        # Modül tamamlandı mı kontrol et
        module_completed = await _check_module_completed(
            lesson.module_id, user_id, progress_repo
        )

        xp_result = await gamification_service.award_xp_and_update_streak(
            user_id=user_id,
            base_xp=lesson.xp_reward,
            module_completed=module_completed,
            user_repo=user_repo,
            badge_repo=badge_repo,
            progress_repo=progress_repo,
        )

        level_up = xp_result.level_up
        new_level = xp_result.new_level
        new_streak = xp_result.new_streak

        # Rozet yanıtlarını oluştur
        from backend.app.schemas.gamification import BADGE_META
        for badge_type in xp_result.badges_earned:
            meta = BADGE_META.get(badge_type, {"title": badge_type, "description": ""})
            badges_earned.append(
                BadgeResponse(
                    id=uuid4(),
                    badge_type=badge_type,
                    earned_at=now,
                    title=meta["title"],
                    description=meta["description"],
                )
            )

        # Liderboard güncelle
        user = await user_repo.get_by_id(user_id)
        if user is not None:
            await add_xp_to_leaderboard(
                redis=redis,
                user_id=user_id,
                username=user.username,
                xp_earned=xp_result.total_xp_earned,
                level=new_level,
                streak=new_streak,
            )

    xp_earned = xp_result.total_xp_earned if xp_result else 0

    if is_completed:
        message = xp_result.message if xp_result else f"Tebrikler! {xp_earned} XP kazandınız."
    else:
        message = f"Skor: {score}/100. Geçmek için en az {settings.LESSON_PASS_SCORE} puan gerekiyor."

    return LessonResultResponse(
        lesson_id=lesson_id,
        score=score,
        correct_count=correct_count,
        wrong_count=wrong_count,
        xp_earned=xp_earned,
        is_completed=is_completed,
        level_up=level_up,
        new_level=new_level,
        new_streak=new_streak,
        badges_earned=badges_earned,
        message=message,
    )
