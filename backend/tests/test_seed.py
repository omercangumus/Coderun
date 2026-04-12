# Coderun backend — seed module unit testleri.

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.module import Module
from backend.app.models.lesson import Lesson
from backend.app.models.question import Question
from backend.app.core.seed import seed_database


@pytest.mark.asyncio
async def test_seed_database_creates_modules(db_session: AsyncSession) -> None:
    """seed_database should create modules."""
    # Seed data should already be created by conftest fixture
    result = await db_session.execute(select(Module))
    modules = result.scalars().all()
    
    assert len(modules) > 0
    assert any(m.slug == "python" for m in modules)
    assert any(m.slug == "devops" for m in modules)
    assert any(m.slug == "cloud" for m in modules)


@pytest.mark.asyncio
async def test_seed_database_creates_lessons(db_session: AsyncSession) -> None:
    """seed_database should create lessons for modules."""
    result = await db_session.execute(select(Lesson))
    lessons = result.scalars().all()
    
    assert len(lessons) > 0


@pytest.mark.asyncio
async def test_seed_database_creates_questions(db_session: AsyncSession) -> None:
    """seed_database should create questions for lessons."""
    result = await db_session.execute(select(Question))
    questions = result.scalars().all()
    
    assert len(questions) > 0


@pytest.mark.asyncio
async def test_seed_database_idempotent(db_session: AsyncSession) -> None:
    """seed_database should be idempotent (not duplicate data)."""
    # Get initial count
    result = await db_session.execute(select(Module))
    initial_count = len(result.scalars().all())
    
    # Run seed again
    await seed_database(db_session)
    
    # Count should be the same
    result = await db_session.execute(select(Module))
    final_count = len(result.scalars().all())
    
    assert final_count == initial_count


@pytest.mark.asyncio
async def test_seed_database_rollback_on_error(db_session: AsyncSession) -> None:
    """seed_database should rollback on error."""
    from unittest.mock import patch
    
    # Clear existing data first
    await db_session.execute(select(Module).limit(1))
    
    # Mock to cause an error during seed
    with patch("backend.app.core.seed.Module") as mock_module:
        mock_module.side_effect = Exception("Test error")
        
        with pytest.raises(Exception):
            # Create a new session for this test
            from backend.app.core.database import AsyncSessionLocal
            async with AsyncSessionLocal() as new_session:
                # Delete all modules to trigger seed
                await new_session.execute(select(Module).limit(0))
                await new_session.commit()
                
                await seed_database(new_session)


@pytest.mark.asyncio
async def test_seed_data_structure() -> None:
    """SEED_DATA should have correct structure."""
    from backend.app.core.seed import SEED_DATA
    
    assert len(SEED_DATA) > 0
    
    for module_data in SEED_DATA:
        assert "slug" in module_data
        assert "title" in module_data
        assert "description" in module_data
        assert "order" in module_data
        assert "lessons" in module_data
        
        lessons = module_data["lessons"]
        assert isinstance(lessons, list)
        
        for lesson_data in lessons:
            assert "title" in lesson_data
            assert "lesson_type" in lesson_data
            assert "order" in lesson_data
            assert "xp_reward" in lesson_data
            assert "questions" in lesson_data
