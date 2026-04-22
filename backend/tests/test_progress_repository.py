# Coderun backend — progress repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.lesson_repository import LessonRepository
from app.repositories.module_repository import ModuleRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.user_repository import UserRepository


@pytest.mark.asyncio
async def test_get_user_lesson_progress(db_session: AsyncSession) -> None:
    """get_user_lesson_progress should return progress for specific lesson."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module and lesson from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        if len(lessons) > 0:
            lesson = lessons[0]
            
            # Create progress
            progress_data = {
                "user_id": user.id,
                "lesson_id": lesson.id,
                "is_completed": True,
                "score": 100,
            }
            await progress_repo.create(progress_data)
            
            # Get progress
            progress = await progress_repo.get_user_lesson_progress(user.id, lesson.id)
            
            assert progress is not None
            assert progress.user_id == user.id
            assert progress.lesson_id == lesson.id
            assert progress.is_completed is True


@pytest.mark.asyncio
async def test_get_user_module_progress(db_session: AsyncSession) -> None:
    """get_user_module_progress should return all progress for module."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        # Create progress for first lesson
        if len(lessons) > 0:
            lesson = lessons[0]
            progress_data = {
                "user_id": user.id,
                "lesson_id": lesson.id,
                "is_completed": True,
                "score": 100,
            }
            await progress_repo.create(progress_data)
            
            # Get module progress
            progress_list = await progress_repo.get_user_module_progress(user.id, module.id)
            
            assert len(progress_list) >= 1
            assert progress_list[0].user_id == user.id


@pytest.mark.asyncio
async def test_get_module_completion_rate(db_session: AsyncSession) -> None:
    """get_module_completion_rate should calculate completion percentage."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        # Complete first lesson
        if len(lessons) > 0:
            lesson = lessons[0]
            progress_data = {
                "user_id": user.id,
                "lesson_id": lesson.id,
                "is_completed": True,
                "score": 100,
            }
            await progress_repo.create(progress_data)
            
            # Get completion rate
            rate = await progress_repo.get_module_completion_rate(user.id, module.id)
            
            assert rate > 0.0
            assert rate <= 1.0


@pytest.mark.asyncio
async def test_get_module_completion_rate_no_progress(db_session: AsyncSession) -> None:
    """get_module_completion_rate should return 0.0 for no progress."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        
        # Get completion rate without any progress
        rate = await progress_repo.get_module_completion_rate(user.id, module.id)
        
        assert rate == 0.0



@pytest.mark.asyncio
async def test_get_user_stats_no_progress(db_session: AsyncSession) -> None:
    """get_user_stats should return zeros for user with no progress."""
    user_repo = UserRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get stats
    stats = await progress_repo.get_user_stats(user.id)
    
    assert stats["completed_lessons"] == 0
    assert stats["completed_modules"] == 0
    assert stats["ongoing_module"] is None


@pytest.mark.asyncio
async def test_get_user_stats_with_progress(db_session: AsyncSession) -> None:
    """get_user_stats should return correct stats with progress."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        # Complete first lesson
        if len(lessons) > 0:
            lesson = lessons[0]
            progress_data = {
                "user_id": user.id,
                "lesson_id": lesson.id,
                "is_completed": True,
                "score": 100,
            }
            await progress_repo.create(progress_data)
            
            # Get stats
            stats = await progress_repo.get_user_stats(user.id)
            
            assert stats["completed_lessons"] >= 1
            assert isinstance(stats["completed_modules"], int)


@pytest.mark.asyncio
async def test_get_completed_lessons_count(db_session: AsyncSession) -> None:
    """get_completed_lessons_count should return correct count."""
    user_repo = UserRepository(db_session)
    module_repo = ModuleRepository(db_session)
    lesson_repo = LessonRepository(db_session)
    progress_repo = ProgressRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Get existing module from seed data
    modules = await module_repo.get_all()
    if len(modules) > 0:
        module = modules[0]
        lessons = await lesson_repo.get_by_module(module.id)
        
        # Complete first two lessons
        completed_count = 0
        for lesson in lessons[:2]:
            progress_data = {
                "user_id": user.id,
                "lesson_id": lesson.id,
                "is_completed": True,
                "score": 100,
            }
            await progress_repo.create(progress_data)
            completed_count += 1
        
        # Get count
        count = await progress_repo.get_completed_lessons_count(user.id)
        
        assert count == completed_count
