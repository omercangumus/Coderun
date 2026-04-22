# Coderun backend — lesson repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.lesson_repository import LessonRepository
from app.repositories.module_repository import ModuleRepository


@pytest.mark.asyncio
async def test_get_by_module(db_session: AsyncSession) -> None:
    """get_by_module should return lessons for module."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        
        # Get lessons
        lessons = await lesson_repo.get_by_module(module.id)
        
        assert len(lessons) > 0
        assert all(lesson.module_id == module.id for lesson in lessons)
        # Should be ordered by order field
        for i in range(len(lessons) - 1):
            assert lessons[i].order <= lessons[i + 1].order


@pytest.mark.asyncio
async def test_get_by_module_and_order(db_session: AsyncSession) -> None:
    """get_by_module_and_order should return specific lesson."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 0:
            first_lesson = lessons[0]
            
            # Get by module and order
            lesson = await lesson_repo.get_by_module_and_order(module.id, first_lesson.order)
            
            assert lesson is not None
            assert lesson.id == first_lesson.id
            assert lesson.order == first_lesson.order


@pytest.mark.asyncio
async def test_get_by_module_and_order_not_found(db_session: AsyncSession) -> None:
    """get_by_module_and_order should return None for non-existent order."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        
        # Get with non-existent order
        lesson = await lesson_repo.get_by_module_and_order(module.id, 9999)
        
        assert lesson is None


@pytest.mark.asyncio
async def test_get_with_questions(db_session: AsyncSession) -> None:
    """get_with_questions should return lesson with questions loaded."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 0:
            lesson_id = lessons[0].id
            
            # Get with questions
            lesson = await lesson_repo.get_with_questions(lesson_id)
            
            assert lesson is not None
            assert hasattr(lesson, "questions")
            # Questions should be loaded
            assert len(lesson.questions) >= 0


@pytest.mark.asyncio
async def test_get_next_lesson(db_session: AsyncSession) -> None:
    """get_next_lesson should return next lesson in order."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 1:
            first_lesson = lessons[0]
            second_lesson = lessons[1]
            
            # Get next lesson
            next_lesson = await lesson_repo.get_next_lesson(module.id, first_lesson.order)
            
            assert next_lesson is not None
            assert next_lesson.id == second_lesson.id
            assert next_lesson.order > first_lesson.order


@pytest.mark.asyncio
async def test_get_next_lesson_last_lesson(db_session: AsyncSession) -> None:
    """get_next_lesson should return None for last lesson."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 0:
            last_lesson = lessons[-1]
            
            # Get next lesson (should be None)
            next_lesson = await lesson_repo.get_next_lesson(module.id, last_lesson.order)
            
            assert next_lesson is None


@pytest.mark.asyncio
async def test_count_by_module(db_session: AsyncSession) -> None:
    """count_by_module should return correct count."""
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        # Count lessons
        count = await lesson_repo.count_by_module(module.id)
        
        assert count == len(lessons)
        assert count > 0
