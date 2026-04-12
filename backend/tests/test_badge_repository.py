# Coderun backend — badge repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.repositories.badge_repository import BadgeRepository
from backend.app.repositories.user_repository import UserRepository


@pytest.mark.asyncio
async def test_get_user_badges(db_session: AsyncSession) -> None:
    """get_user_badges should return all badges for user."""
    user_repo = UserRepository(db_session)
    badge_repo = BadgeRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Award badge
    badge_data = {
        "user_id": user.id,
        "badge_type": "first_lesson",
    }
    await badge_repo.create(badge_data)
    
    # Get badges
    badges = await badge_repo.get_user_badges(user.id)
    
    assert len(badges) >= 1
    assert badges[0].user_id == user.id
    assert badges[0].badge_type == "first_lesson"


@pytest.mark.asyncio
async def test_has_badge(db_session: AsyncSession) -> None:
    """has_badge should check if user has specific badge."""
    user_repo = UserRepository(db_session)
    badge_repo = BadgeRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Award badge
    badge_data = {
        "user_id": user.id,
        "badge_type": "streak_7",
    }
    await badge_repo.create(badge_data)
    
    # Check badge
    has_badge = await badge_repo.has_badge(user.id, "streak_7")
    has_no_badge = await badge_repo.has_badge(user.id, "streak_30")
    
    assert has_badge is True
    assert has_no_badge is False


@pytest.mark.asyncio
async def test_award_badge(db_session: AsyncSession) -> None:
    """award_badge should create new badge for user."""
    user_repo = UserRepository(db_session)
    badge_repo = BadgeRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Award badge
    badge = await badge_repo.award_badge(user.id, "level_5")
    
    assert badge is not None
    assert badge.user_id == user.id
    assert badge.badge_type == "level_5"
    
    # Verify badge exists
    has_badge = await badge_repo.has_badge(user.id, "level_5")
    assert has_badge is True


@pytest.mark.asyncio
async def test_award_badge_no_duplicate(db_session: AsyncSession) -> None:
    """award_badge should not create duplicate badges."""
    user_repo = UserRepository(db_session)
    badge_repo = BadgeRepository(db_session)
    
    # Create user
    user = await user_repo.create({
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    })
    
    # Award badge twice
    badge1 = await badge_repo.award_badge(user.id, "module_complete")
    badge2 = await badge_repo.award_badge(user.id, "module_complete")
    
    # Get all badges
    badges = await badge_repo.get_user_badges(user.id)
    module_complete_badges = [b for b in badges if b.badge_type == "module_complete"]
    
    # Should only have one badge
    assert len(module_complete_badges) == 1
