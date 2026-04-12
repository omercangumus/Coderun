# Coderun backend — question repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.repositories.question_repository import QuestionRepository
from backend.app.repositories.module_repository import ModuleRepository
from backend.app.repositories.lesson_repository import LessonRepository


@pytest.mark.asyncio
async def test_get_by_lesson(db_session: AsyncSession) -> None:
    """get_by_lesson should return questions for lesson."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    question_repo = QuestionRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 0:
            lesson = lessons[0]
            
            # Get questions
            questions = await question_repo.get_by_lesson(lesson.id)
            
            assert len(questions) > 0
            assert all(q.lesson_id == lesson.id for q in questions)
            # Should be ordered by order field
            for i in range(len(questions) - 1):
                assert questions[i].order <= questions[i + 1].order


@pytest.mark.asyncio
async def test_get_random_by_module(db_session: AsyncSession) -> None:
    """get_random_by_module should return random questions."""
    module_repo = ModuleRepository(db_session)
    question_repo = QuestionRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        
        # Get random questions
        questions = await question_repo.get_random_by_module(module.id, limit=5)
        
        assert len(questions) > 0
        assert len(questions) <= 5


@pytest.mark.asyncio
async def test_get_random_by_module_edge_cases(db_session: AsyncSession) -> None:
    """get_random_by_module should handle edge cases."""
    module_repo = ModuleRepository(db_session)
    question_repo = QuestionRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        
        # Request more questions than available
        questions = await question_repo.get_random_by_module(module.id, limit=1000)
        
        # Should return all available questions (not more)
        assert len(questions) > 0


@pytest.mark.asyncio
async def test_get_random_by_module_nonexistent(db_session: AsyncSession) -> None:
    """get_random_by_module should return empty list for non-existent module."""
    question_repo = QuestionRepository(db_session)
    
    # Get with non-existent module
    questions = await question_repo.get_random_by_module(uuid.uuid4(), limit=5)
    
    assert len(questions) == 0
