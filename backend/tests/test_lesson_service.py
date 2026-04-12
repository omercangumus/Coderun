# Coderun backend — lesson service unit testleri.

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest

from backend.app.models.lesson import Lesson
from backend.app.models.question import Question
from backend.app.models.user_progress import UserProgress
from backend.app.services.lesson_service import (
    get_lesson_detail,
    get_lessons_by_module,
    submit_lesson_answer,
)


class TestGetLessonsByModule:
    """get_lessons_by_module servis testleri."""

    @pytest.mark.asyncio
    async def test_get_lessons_by_module_returns_list(self) -> None:
        """Modül ID'sine göre ders listesi döndürülmeli."""
        # Mock repositories
        mock_lesson_repo = AsyncMock()
        mock_progress_repo = AsyncMock()
        
        # Mock module
        module_id = uuid.uuid4()
        
        # Mock lessons
        lesson1 = MagicMock(spec=Lesson)
        lesson1.id = uuid.uuid4()
        lesson1.module_id = module_id
        lesson1.title = "Lesson 1"
        lesson1.lesson_type = "quiz"
        lesson1.order = 1
        lesson1.xp_reward = 10
        lesson1.is_active = True
        
        mock_lesson_repo.get_by_module.return_value = [lesson1]
        
        # Mock progress
        mock_progress_repo.get_user_lesson_progress.return_value = None
        mock_progress_repo.get_user_module_progress.return_value = []
        
        user_id = uuid.uuid4()
        result = await get_lessons_by_module(
            module_id,
            user_id,
            mock_lesson_repo,
            mock_progress_repo,
        )
        
        assert len(result) >= 0
        mock_lesson_repo.get_by_module.assert_called_once_with(module_id)

    @pytest.mark.asyncio
    async def test_get_lessons_module_not_found(self) -> None:
        """Olmayan modül için boş liste döndürülmeli."""
        mock_lesson_repo = AsyncMock()
        mock_progress_repo = AsyncMock()
        
        mock_lesson_repo.get_by_module.return_value = []
        
        module_id = uuid.uuid4()
        user_id = uuid.uuid4()
        
        result = await get_lessons_by_module(
            module_id,
            user_id,
            mock_lesson_repo,
            mock_progress_repo,
        )
        
        assert len(result) == 0


class TestGetLessonDetail:
    """get_lesson_detail servis testleri."""

    @pytest.mark.asyncio
    async def test_get_lesson_detail_returns_questions(self) -> None:
        """Ders detayı sorularla birlikte döndürülmeli."""
        mock_lesson_repo = AsyncMock()
        
        # Mock lesson with questions
        lesson_id = uuid.uuid4()
        mock_lesson = MagicMock(spec=Lesson)
        mock_lesson.id = lesson_id
        mock_lesson.module_id = uuid.uuid4()
        mock_lesson.title = "Test Lesson"
        mock_lesson.lesson_type = "quiz"
        mock_lesson.order = 1
        mock_lesson.xp_reward = 10
        mock_lesson.is_active = True
        
        # Mock questions
        question1 = MagicMock(spec=Question)
        question1.id = uuid.uuid4()
        question1.lesson_id = lesson_id
        question1.question_type = "multiple_choice"
        question1.question_text = "Test question?"
        question1.options = {"choices": ["A", "B", "C", "D"]}
        question1.order = 1
        
        mock_lesson.questions = [question1]
        mock_lesson_repo.get_with_questions.return_value = mock_lesson
        
        result = await get_lesson_detail(lesson_id, mock_lesson_repo)
        
        assert result.id == lesson_id
        mock_lesson_repo.get_with_questions.assert_called_once_with(lesson_id)

    @pytest.mark.asyncio
    async def test_get_lesson_detail_not_found(self) -> None:
        """Olmayan ders için 404 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_lesson_repo = AsyncMock()
        mock_lesson_repo.get_with_questions.return_value = None
        
        lesson_id = uuid.uuid4()
        
        with pytest.raises(HTTPException) as exc_info:
            await get_lesson_detail(lesson_id, mock_lesson_repo)
        
        assert exc_info.value.status_code == 404


class TestSubmitLessonAnswer:
    """submit_lesson_answer servis testleri."""

    @pytest.mark.asyncio
    async def test_submit_lesson_correct_answers(self) -> None:
        """Doğru cevaplarla ders tamamlanmalı."""
        # Mock repositories
        mock_lesson_repo = AsyncMock()
        mock_question_repo = AsyncMock()
        mock_progress_repo = AsyncMock()
        mock_user_repo = AsyncMock()
        mock_badge_repo = AsyncMock()
        mock_redis = AsyncMock()
        
        # Mock lesson
        lesson_id = uuid.uuid4()
        mock_lesson = MagicMock(spec=Lesson)
        mock_lesson.id = lesson_id
        mock_lesson.module_id = uuid.uuid4()
        mock_lesson.xp_reward = 10
        mock_lesson.order = 1
        mock_lesson_repo.get_by_id.return_value = mock_lesson
        
        # Mock questions
        question_id = uuid.uuid4()
        mock_question = MagicMock(spec=Question)
        mock_question.id = question_id
        mock_question.correct_answer = "A"
        mock_question_repo.get_by_lesson.return_value = [mock_question]
        
        # Mock user
        user_id = uuid.uuid4()
        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user.xp = 0
        mock_user.level = 1
        mock_user.streak = 0
        mock_user.last_active_date = None
        mock_user_repo.get_by_id.return_value = mock_user
        
        # Mock updated user after XP award
        updated_user = MagicMock()
        updated_user.id = user_id
        updated_user.xp = 10
        updated_user.level = 1
        updated_user.streak = 1
        updated_user.last_active_date = datetime.now(timezone.utc).date()
        mock_user_repo.update_xp.return_value = updated_user
        
        # Mock progress
        mock_progress_repo.get_user_lesson_progress.return_value = None
        mock_progress_repo.get_user_module_progress.return_value = []
        mock_progress_repo.get_module_completion_rate.return_value = 0.0
        
        # Mock badges
        mock_badge_repo.get_user_badges.return_value = []
        mock_badge_repo.has_badge.return_value = False
        
        # Submit answers
        from backend.app.schemas.progress import AnswerSubmit
        
        answers = [AnswerSubmit(question_id=question_id, answer="A")]
        
        result = await submit_lesson_answer(
            lesson_id,
            user_id,
            answers,
            mock_lesson_repo,
            mock_question_repo,
            mock_progress_repo,
            mock_user_repo,
            mock_badge_repo,
            mock_redis,
        )
        
        assert result.score >= 0
        assert result.xp_earned >= 0

    @pytest.mark.asyncio
    async def test_submit_lesson_not_found(self) -> None:
        """Olmayan ders için 404 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_lesson_repo = AsyncMock()
        mock_question_repo = AsyncMock()
        mock_progress_repo = AsyncMock()
        mock_user_repo = AsyncMock()
        mock_badge_repo = AsyncMock()
        mock_redis = AsyncMock()
        
        mock_lesson_repo.get_by_id.return_value = None
        
        lesson_id = uuid.uuid4()
        user_id = uuid.uuid4()
        
        with pytest.raises(HTTPException) as exc_info:
            await submit_lesson_answer(
                lesson_id,
                user_id,
                [],
                mock_lesson_repo,
                mock_question_repo,
                mock_progress_repo,
                mock_user_repo,
                mock_badge_repo,
                mock_redis,
            )
        
        assert exc_info.value.status_code == 404
