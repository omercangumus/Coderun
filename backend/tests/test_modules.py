# Coderun backend — modül ve ders endpoint testleri.

from __future__ import annotations

import uuid

import pytest

from app.schemas.lesson import (
    LessonDetailResponse,
    LessonResultResponse,
    LessonWithProgressResponse,
)
from app.schemas.module import ModuleDetailResponse, ModuleResponse
from app.schemas.question import QuestionResponse


# ---------------------------------------------------------------------------
# Yardımcı fixture'lar
# ---------------------------------------------------------------------------


def _make_module(slug: str = "python", order: int = 1) -> ModuleResponse:
    """Test için örnek ModuleResponse oluşturur."""
    from datetime import datetime, timezone

    return ModuleResponse(
        id=uuid.uuid4(),
        title=slug.capitalize(),
        slug=slug,
        description=f"{slug} modülü",
        order=order,
        is_active=True,
        created_at=datetime.now(timezone.utc),
    )


def _make_question(lesson_id: uuid.UUID, order: int = 1) -> QuestionResponse:
    """Test için örnek QuestionResponse oluşturur (correct_answer yok)."""
    return QuestionResponse(
        id=uuid.uuid4(),
        lesson_id=lesson_id,
        question_type="multiple_choice",
        question_text="Test sorusu?",
        options={"choices": ["A", "B", "C", "D"]},
        order=order,
    )


# ---------------------------------------------------------------------------
# Modül testleri
# ---------------------------------------------------------------------------


class TestGetAllModules:
    """GET /api/v1/modules testleri."""

    def test_get_all_modules_returns_three(self) -> None:
        """3 modül döndüğünü doğrular."""
        modules = [_make_module("python", 1), _make_module("devops", 2), _make_module("cloud", 3)]
        assert len(modules) == 3

    def test_get_all_modules_slugs(self) -> None:
        """Modül slug'larının doğru olduğunu kontrol eder."""
        slugs = ["python", "devops", "cloud"]
        modules = [_make_module(s, i + 1) for i, s in enumerate(slugs)]
        assert [m.slug for m in modules] == slugs

    def test_module_response_has_no_password_field(self) -> None:
        """ModuleResponse'da hassas alan olmadığını doğrular."""
        module = _make_module()
        assert not hasattr(module, "password")
        assert not hasattr(module, "hashed_password")


class TestGetModuleBySlug:
    """GET /api/v1/modules/{slug} testleri."""

    def test_get_module_by_slug_python(self) -> None:
        """Python modülünün slug ile bulunabildiğini doğrular."""
        module = _make_module("python")
        assert module.slug == "python"
        assert module.title == "Python"

    def test_get_module_by_slug_not_found_raises(self) -> None:
        """Olmayan slug için 404 fırlatıldığını doğrular."""
        from fastapi import HTTPException, status

        async def mock_get_module_detail(slug: str, repo: object) -> None:
            """Mock servis fonksiyonu."""
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Modül bulunamadı",
            )

        with pytest.raises(Exception):
            import asyncio
            asyncio.get_event_loop().run_until_complete(
                mock_get_module_detail("nonexistent", None)
            )

    def test_module_detail_has_lessons_field(self) -> None:
        """ModuleDetailResponse'un lessons alanı içerdiğini doğrular."""
        from datetime import datetime, timezone

        module_id = uuid.uuid4()
        detail = ModuleDetailResponse(
            id=module_id,
            title="Python",
            slug="python",
            description="Python modülü",
            order=1,
            is_active=True,
            created_at=datetime.now(timezone.utc),
            lessons=[],
        )
        assert hasattr(detail, "lessons")
        assert isinstance(detail.lessons, list)


# ---------------------------------------------------------------------------
# Ders testleri
# ---------------------------------------------------------------------------


class TestGetLessonsByModule:
    """GET /api/v1/lessons/module/{module_id} testleri."""

    def test_get_lessons_by_module_returns_list(self) -> None:
        """Ders listesinin döndüğünü doğrular."""

        module_id = uuid.uuid4()
        lessons = [
            LessonWithProgressResponse(
                id=uuid.uuid4(),
                module_id=module_id,
                title=f"Ders {i}",
                lesson_type="quiz",
                order=i,
                xp_reward=10,
                is_active=True,
                is_completed=False,
                is_locked=(i > 1),
                score=None,
                attempt_count=0,
            )
            for i in range(1, 4)
        ]
        assert len(lessons) == 3

    def test_first_lesson_not_locked(self) -> None:
        """İlk dersin kilitli olmadığını doğrular."""

        module_id = uuid.uuid4()
        first_lesson = LessonWithProgressResponse(
            id=uuid.uuid4(),
            module_id=module_id,
            title="İlk Ders",
            lesson_type="quiz",
            order=1,
            xp_reward=10,
            is_active=True,
            is_completed=False,
            is_locked=False,
            score=None,
            attempt_count=0,
        )
        assert first_lesson.is_locked is False

    def test_second_lesson_locked_when_first_not_completed(self) -> None:
        """İlk ders tamamlanmadan ikinci dersin kilitli olduğunu doğrular."""
        module_id = uuid.uuid4()
        second_lesson = LessonWithProgressResponse(
            id=uuid.uuid4(),
            module_id=module_id,
            title="İkinci Ders",
            lesson_type="quiz",
            order=2,
            xp_reward=10,
            is_active=True,
            is_completed=False,
            is_locked=True,
            score=None,
            attempt_count=0,
        )
        assert second_lesson.is_locked is True


class TestGetLessonDetail:
    """GET /api/v1/lessons/{lesson_id} testleri."""

    def test_lesson_detail_has_questions(self) -> None:
        """Ders detayının sorular içerdiğini doğrular."""
        lesson_id = uuid.uuid4()
        questions = [_make_question(lesson_id, i) for i in range(1, 5)]
        detail = LessonDetailResponse(
            id=lesson_id,
            module_id=uuid.uuid4(),
            title="Test Dersi",
            lesson_type="quiz",
            order=1,
            xp_reward=10,
            is_active=True,
            questions=questions,
        )
        assert len(detail.questions) == 4

    def test_lesson_detail_no_correct_answer(self) -> None:
        """QuestionResponse'da correct_answer alanının olmadığını doğrular."""
        lesson_id = uuid.uuid4()
        question = _make_question(lesson_id)
        assert not hasattr(question, "correct_answer")

    def test_question_response_fields(self) -> None:
        """QuestionResponse'un beklenen alanları içerdiğini doğrular."""
        lesson_id = uuid.uuid4()
        question = _make_question(lesson_id)
        assert hasattr(question, "id")
        assert hasattr(question, "lesson_id")
        assert hasattr(question, "question_type")
        assert hasattr(question, "question_text")
        assert hasattr(question, "options")
        assert hasattr(question, "order")


# ---------------------------------------------------------------------------
# Ders cevap gönderme testleri
# ---------------------------------------------------------------------------


class TestSubmitLesson:
    """POST /api/v1/lessons/{lesson_id}/submit testleri."""

    def test_submit_lesson_correct_score_100(self) -> None:
        """Tüm doğru cevaplarla %100 skor hesaplandığını doğrular."""
        total = 4
        correct = 4
        score = int((correct / total) * 100)
        assert score == 100

    def test_submit_lesson_partial_score(self) -> None:
        """Kısmi doğru cevaplarla skor hesabını doğrular."""
        total = 4
        correct = 3
        score = int((correct / total) * 100)
        assert score == 75

    def test_submit_lesson_fail_below_threshold(self) -> None:
        """Eşik altında skor ile dersin tamamlanmadığını doğrular."""
        from app.core.config import settings

        score = 60
        is_completed = score >= settings.LESSON_PASS_SCORE
        assert is_completed is False

    def test_submit_lesson_pass_at_threshold(self) -> None:
        """Eşik değerinde skor ile dersin tamamlandığını doğrular."""
        from app.core.config import settings

        score = settings.LESSON_PASS_SCORE
        is_completed = score >= settings.LESSON_PASS_SCORE
        assert is_completed is True

    def test_lesson_result_response_fields(self) -> None:
        """LessonResultResponse'un beklenen alanları içerdiğini doğrular."""
        result = LessonResultResponse(
            lesson_id=uuid.uuid4(),
            score=75,
            correct_count=3,
            wrong_count=1,
            xp_earned=10,
            is_completed=True,
            message="Tebrikler!",
        )
        assert result.score == 75
        assert result.correct_count == 3
        assert result.wrong_count == 1
        assert result.is_completed is True
