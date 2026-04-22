# Coderun backend — user repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import UserRepository


@pytest.mark.asyncio
async def test_get_by_email(db_session: AsyncSession) -> None:
    """get_by_email should return user by email."""
    repo = UserRepository(db_session)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    created_user = await repo.create(user_data)
    
    # Get by email
    user = await repo.get_by_email(created_user.email)
    
    assert user is not None
    assert user.email == created_user.email
    assert user.id == created_user.id


@pytest.mark.asyncio
async def test_get_by_email_not_found(db_session: AsyncSession) -> None:
    """get_by_email should return None for non-existent email."""
    repo = UserRepository(db_session)
    
    user = await repo.get_by_email("nonexistent@example.com")
    
    assert user is None


@pytest.mark.asyncio
async def test_get_by_username(db_session: AsyncSession) -> None:
    """get_by_username should return user by username."""
    repo = UserRepository(db_session)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    created_user = await repo.create(user_data)
    
    # Get by username
    user = await repo.get_by_username(created_user.username)
    
    assert user is not None
    assert user.username == created_user.username
    assert user.id == created_user.id


@pytest.mark.asyncio
async def test_get_by_username_not_found(db_session: AsyncSession) -> None:
    """get_by_username should return None for non-existent username."""
    repo = UserRepository(db_session)
    
    user = await repo.get_by_username("nonexistentuser")
    
    assert user is None


@pytest.mark.asyncio
async def test_update_xp(db_session: AsyncSession) -> None:
    """update_xp should increase user XP."""
    repo = UserRepository(db_session)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    user = await repo.create(user_data)
    
    # Update XP
    new_xp = 150
    updated_user = await repo.update_xp(user.id, new_xp)
    
    assert updated_user is not None
    assert updated_user.xp == new_xp


@pytest.mark.asyncio
async def test_update_streak(db_session: AsyncSession) -> None:
    """update_streak should update user streak and last_active_date."""
    from datetime import date
    
    repo = UserRepository(db_session)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    user = await repo.create(user_data)
    
    # Update streak
    new_streak = 5
    today = date.today()
    updated_user = await repo.update(user.id, {
        "streak": new_streak,
        "last_active_date": today,
    })
    
    assert updated_user is not None
    assert updated_user.streak == new_streak
    assert updated_user.last_active_date == today



@pytest.mark.asyncio
async def test_update_user(db_session: AsyncSession) -> None:
    """update should update user fields."""
    repo = UserRepository(db_session)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    user = await repo.create(user_data)
    
    # Update user
    new_username = f"updated_{uuid.uuid4().hex[:8]}"
    updated_user = await repo.update(user.id, {"username": new_username})
    
    assert updated_user is not None
    assert updated_user.username == new_username
    assert updated_user.id == user.id


@pytest.mark.asyncio
async def test_update_xp_user_not_found(db_session: AsyncSession) -> None:
    """update_xp should raise ValueError for non-existent user."""
    repo = UserRepository(db_session)
    
    with pytest.raises(ValueError, match="User not found"):
        await repo.update_xp(uuid.uuid4(), 100)


@pytest.mark.asyncio
async def test_update_streak_user_not_found(db_session: AsyncSession) -> None:
    """update_streak should raise ValueError for non-existent user."""
    from datetime import date
    
    repo = UserRepository(db_session)
    
    with pytest.raises(ValueError, match="User not found"):
        await repo.update_streak(uuid.uuid4(), 5, date.today())
