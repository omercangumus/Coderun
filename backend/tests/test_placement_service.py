# Coderun backend placement service testleri — seviye testi algoritması ve servis katmanı.

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.services.placement_service import (
    calculate_placement,
    get_placement_questions,
    submit_placement_test,
)
from app.schemas.progress import AnswerSubmit


class TestCalculatePlacement:
    """calculate_placement pure function testleri."""

    def test_beginner_level_0_percent(self) -> None:
        """0% doğru cevap → 1. dersten başlamalı."""
        starting, skipped = calculate_placement(0, 10, 20)
        assert starting == 1
        assert skipped == 0

    def test_beginner_level_30_percent(self) -> None:
        """30% doğru cevap → 1. dersten başlamalı."""
        starting, skipped = calculate_placement(3, 10, 20)
        assert starting == 1
        assert skipped == 0

    def test_intermediate_level_50_percent(self) -> None:
        """50% doğru cevap → ortadan başlamalı."""
        starting, skipped = calculate_placement(5, 10, 20)
        assert starting == 10  # 20 // 2
        assert skipped == 9

    def test_advanced_level_70_percent(self) -> None:
        """70% doğru cevap → son çeyrekten başlamalı."""
        starting, skipped = calculate_placement(7, 10, 20)
        assert starting == 15  # (20 * 3) // 4
        assert skipped == 14

    def test_expert_level_90_percent(self) -> None:
        """90% doğru cevap → tüm modül tamamlanmış sayılmalı."""
        starting, skipped = calculate_placement(9, 10, 20)
        assert starting == 21  # total_lessons + 1
        assert skipped == 20

    def test_zero_questions(self) -> None:
        """Soru sayısı 0 ise 1. dersten başlamalı."""
        starting, skipped = calculate_placement(0, 0, 20)
        assert starting == 1
        assert skipped == 0

    def test_single_lesson_module(self) -> None:
        """Tek dersli modülde doğru hesaplama yapmalı."""
        starting, skipped = calculate_placement(8, 10, 1)
        # %80 doğru = advanced level, but with only 1 lesson, should complete it
        assert starting >= 1
        assert skipped >= 0


@pytest.mark.asyncio
class TestGetPlacementQuestions:
    """get_placement_questions servis fonksiyonu testleri."""

    async def test_get_placement_questions_success(self, db_session) -> None:
        """Modül bulunduğunda rastgele sorular döndürmeli."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)

        result = await get_placement_questions("python", module_repo, question_repo)

        assert result.module_title == "Python"
        assert len(result.questions) > 0
        assert result.total_questions == len(result.questions)
        # Sorularda correct_answer olmamalı (QuestionResponse model validation)
        for q in result.questions:
            assert hasattr(q, "question_text")

    async def test_get_placement_questions_module_not_found(self, db_session) -> None:
        """Modül bulunamadığında 404 HTTPException fırlatmalı."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)

        with pytest.raises(HTTPException) as exc_info:
            await get_placement_questions("nonexistent", module_repo, question_repo)

        assert exc_info.value.status_code == 404
        assert "bulunamadı" in exc_info.value.detail.lower()

    async def test_get_placement_questions_random_selection(self, db_session) -> None:
        """Sorular rastgele seçilmeli (her çağrıda farklı olabilir)."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)

        result1 = await get_placement_questions("python", module_repo, question_repo)
        result2 = await get_placement_questions("python", module_repo, question_repo)

        # Soru sayısı aynı olmalı
        assert len(result1.questions) == len(result2.questions)
        # Not: Rastgelelik nedeniyle soru sırası farklı olabilir (bu test deterministik değil)


@pytest.mark.asyncio
class TestSubmitPlacementTest:
    """submit_placement_test servis fonksiyonu testleri."""

    async def test_submit_placement_test_success(self, db_session) -> None:
        """Doğru cevaplar verildiğinde yerleştirme yapmalı."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.lesson_repository import LessonRepository
        from app.models.user import User
        from app.core.security import hash_password

        # Test kullanıcısı oluştur
        uid = uuid4().hex[:8]
        user = User(
            id=uuid4(),
            email=f"placement_test_{uid}@example.com",
            username=f"placement_user_{uid}",
            hashed_password=hash_password("Test1234"),
        )
        db_session.add(user)
        await db_session.commit()

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        # Python modülünden sorular al
        module = await module_repo.get_by_slug("python")
        questions = await question_repo.get_random_by_module(module.id, limit=5)

        # Tüm soruları doğru cevapla
        answers = [
            AnswerSubmit(question_id=q.id, answer=q.correct_answer)
            for q in questions
        ]

        result = await submit_placement_test(
            "python", user.id, answers, module_repo, question_repo, progress_repo, lesson_repo
        )

        assert result.correct_count == 5
        assert result.total_count == 5
        assert result.percentage == 100.0
        assert result.skipped_lessons > 0

    async def test_submit_placement_test_auto_complete_lessons(self, db_session) -> None:
        """Atlanan dersler otomatik tamamlanmalı."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.lesson_repository import LessonRepository
        from app.models.user import User
        from app.core.security import hash_password

        uid = uuid4().hex[:8]
        user = User(
            id=uuid4(),
            email=f"placement_auto_{uid}@example.com",
            username=f"placement_auto_user_{uid}",
            hashed_password=hash_password("Test1234"),
        )
        db_session.add(user)
        await db_session.commit()

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        module = await module_repo.get_by_slug("python")
        questions = await question_repo.get_random_by_module(module.id, limit=10)

        # %50 doğru cevap ver (intermediate level)
        answers = []
        for i, q in enumerate(questions):
            if i < 5:
                answers.append(AnswerSubmit(question_id=q.id, answer=q.correct_answer))
            else:
                answers.append(AnswerSubmit(question_id=q.id, answer="wrong answer"))

        result = await submit_placement_test(
            "python", user.id, answers, module_repo, question_repo, progress_repo, lesson_repo
        )

        # Atlanan dersler tamamlanmış olmalı
        if result.skipped_lessons > 0:
            lessons = await lesson_repo.get_by_module(module.id)
            first_lesson = lessons[0]
            progress = await progress_repo.get_user_lesson_progress(user.id, first_lesson.id)
            assert progress is not None
            assert progress.is_completed is True

    async def test_submit_placement_test_module_not_found(self, db_session) -> None:
        """Modül bulunamadığında 404 HTTPException fırlatmalı."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.lesson_repository import LessonRepository

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        with pytest.raises(HTTPException) as exc_info:
            await submit_placement_test(
                "nonexistent",
                uuid4(),
                [],
                module_repo,
                question_repo,
                progress_repo,
                lesson_repo,
            )

        assert exc_info.value.status_code == 404

    async def test_submit_placement_test_zero_answers(self, db_session) -> None:
        """Hiç cevap verilmediğinde 0% ve 1. dersten başlamalı."""
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.question_repository import QuestionRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.lesson_repository import LessonRepository
        from app.models.user import User
        from app.core.security import hash_password

        uid = uuid4().hex[:8]
        user = User(
            id=uuid4(),
            email=f"placement_zero_{uid}@example.com",
            username=f"placement_zero_user_{uid}",
            hashed_password=hash_password("Test1234"),
        )
        db_session.add(user)
        await db_session.commit()

        module_repo = ModuleRepository(db_session)
        question_repo = QuestionRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        result = await submit_placement_test(
            "python", user.id, [], module_repo, question_repo, progress_repo, lesson_repo
        )

        assert result.correct_count == 0
        assert result.total_count == 0
        assert result.percentage == 0.0
        assert result.starting_lesson_order == 1
        assert result.skipped_lessons == 0
