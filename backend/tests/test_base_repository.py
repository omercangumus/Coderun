# Coderun backend — base repository unit testleri.

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.user import User
from backend.app.repositories.base_repository import BaseRepository


@pytest.mark.asyncio
async def test_base_repository_create(db_session: AsyncSession) -> None:
    """create should insert new entity."""
    repo = BaseRepository(db_session, User)
    
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    
    user = await repo.create(user_data)
    
    assert user.id is not None
    assert user.email == user_data["email"]
    assert user.username == user_data["username"]


@pytest.mark.asyncio
async def test_base_repository_get_by_id(db_session: AsyncSession) -> None:
    """get_by_id should return entity by UUID."""
    repo = BaseRepository(db_session, User)
    
    # Create a user first
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    created_user = await repo.create(user_data)
    
    # Get by ID
    user = await repo.get_by_id(created_user.id)
    
    assert user is not None
    assert user.id == created_user.id
    assert user.email == created_user.email


@pytest.mark.asyncio
async def test_base_repository_get_by_id_not_found(db_session: AsyncSession) -> None:
    """get_by_id should return None for non-existent UUID."""
    repo = BaseRepository(db_session, User)
    
    non_existent_id = uuid.uuid4()
    user = await repo.get_by_id(non_existent_id)
    
    assert user is None


@pytest.mark.asyncio
async def test_base_repository_get_all(db_session: AsyncSession) -> None:
    """get_all should return paginated list."""
    repo = BaseRepository(db_session, User)
    
    # Create multiple users
    for i in range(3):
        await repo.create({
            "email": f"test_{i}_{uuid.uuid4().hex[:8]}@example.com",
            "username": f"testuser_{i}_{uuid.uuid4().hex[:8]}",
            "hashed_password": "hashed_password_123",
        })
    
    # Get all with pagination
    users = await repo.get_all(skip=0, limit=10)
    
    assert len(users) >= 3


@pytest.mark.asyncio
async def test_base_repository_update(db_session: AsyncSession) -> None:
    """update should modify existing entity."""
    repo = BaseRepository(db_session, User)
    
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
    assert updated_user.email == user.email


@pytest.mark.asyncio
async def test_base_repository_delete(db_session: AsyncSession) -> None:
    """delete should remove entity."""
    repo = BaseRepository(db_session, User)
    
    # Create a user
    user_data = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "username": f"testuser_{uuid.uuid4().hex[:8]}",
        "hashed_password": "hashed_password_123",
    }
    user = await repo.create(user_data)
    user_id = user.id
    
    # Delete user
    result = await repo.delete(user_id)
    
    assert result is True
    
    # Verify deletion
    deleted_user = await repo.get_by_id(user_id)
    assert deleted_user is None


@pytest.mark.asyncio
async def test_base_repository_delete_not_found(db_session: AsyncSession) -> None:
    """delete should return False for non-existent UUID."""
    repo = BaseRepository(db_session, User)
    
    non_existent_id = uuid.uuid4()
    result = await repo.delete(non_existent_id)
    
    assert result is False
