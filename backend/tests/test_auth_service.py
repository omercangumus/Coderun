# Coderun backend — auth service unit testleri.

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from jose import jwt

from backend.app.core.config import settings
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from backend.app.schemas.auth import UserCreate
from backend.app.services.auth_service import (
    get_current_user,
    login_user,
    refresh_access_token,
    register_user,
)


class TestRegisterUser:
    """register_user servis testleri."""

    @pytest.mark.asyncio
    async def test_register_user_success(self) -> None:
        """Yeni kullanıcı başarıyla oluşturulmalı."""
        mock_user_repo = AsyncMock()
        
        # Mock existing user checks
        mock_user_repo.get_by_email.return_value = None
        mock_user_repo.get_by_username.return_value = None
        
        # Mock user creation
        mock_user = MagicMock()
        mock_user.id = uuid.uuid4()
        mock_user.email = "test@example.com"
        mock_user.username = "testuser"
        mock_user_repo.create.return_value = mock_user
        
        user_create = UserCreate(
            email="test@example.com",
            username="testuser",
            password="StrongPass1",
        )
        
        result = await register_user(user_create, mock_user_repo)
        
        assert result.email == "test@example.com"
        mock_user_repo.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_user_duplicate_email(self) -> None:
        """Aynı e-posta ile kullanıcı oluşturulamaz."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Mock existing user
        existing_user = MagicMock()
        mock_user_repo.get_by_email.return_value = existing_user
        
        user_create = UserCreate(
            email="existing@example.com",
            username="newuser",
            password="StrongPass1",
        )
        
        with pytest.raises(HTTPException) as exc_info:
            await register_user(user_create, mock_user_repo)
        
        assert exc_info.value.status_code == 400

    @pytest.mark.asyncio
    async def test_register_user_duplicate_username(self) -> None:
        """Aynı kullanıcı adı ile kullanıcı oluşturulamaz."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Mock no email conflict but username conflict
        mock_user_repo.get_by_email.return_value = None
        existing_user = MagicMock()
        mock_user_repo.get_by_username.return_value = existing_user
        
        user_create = UserCreate(
            email="new@example.com",
            username="existinguser",
            password="StrongPass1",
        )
        
        with pytest.raises(HTTPException) as exc_info:
            await register_user(user_create, mock_user_repo)
        
        assert exc_info.value.status_code == 400


class TestLoginUser:
    """login_user servis testleri."""

    @pytest.mark.asyncio
    async def test_login_user_success(self) -> None:
        """Doğru bilgilerle kullanıcı giriş yapmalı."""
        from backend.app.core.security import hash_password
        
        mock_user_repo = AsyncMock()
        
        # Mock user with hashed password
        mock_user = MagicMock()
        mock_user.id = uuid.uuid4()
        mock_user.email = "test@example.com"
        mock_user.hashed_password = hash_password("StrongPass1")
        mock_user.is_active = True
        mock_user_repo.get_by_email.return_value = mock_user
        
        result = await login_user(
            "test@example.com",
            "StrongPass1",
            mock_user_repo,
        )
        
        assert result.access_token is not None
        assert result.refresh_token is not None

    @pytest.mark.asyncio
    async def test_login_user_wrong_password(self) -> None:
        """Yanlış şifre ile giriş başarısız olmalı."""
        from fastapi import HTTPException
        from backend.app.core.security import hash_password
        
        mock_user_repo = AsyncMock()
        
        # Mock user
        mock_user = MagicMock()
        mock_user.email = "test@example.com"
        mock_user.hashed_password = hash_password("StrongPass1")
        mock_user.is_active = True
        mock_user_repo.get_by_email.return_value = mock_user
        
        with pytest.raises(HTTPException) as exc_info:
            await login_user(
                "test@example.com",
                "WrongPass1",
                mock_user_repo,
            )
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_login_user_not_found(self) -> None:
        """Olmayan kullanıcı ile giriş başarısız olmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        mock_user_repo.get_by_email.return_value = None
        
        with pytest.raises(HTTPException) as exc_info:
            await login_user(
                "nonexistent@example.com",
                "StrongPass1",
                mock_user_repo,
            )
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_login_user_inactive(self) -> None:
        """Pasif kullanıcı giriş yapamamalı."""
        from fastapi import HTTPException
        from backend.app.core.security import hash_password
        
        mock_user_repo = AsyncMock()
        
        # Mock inactive user
        mock_user = MagicMock()
        mock_user.email = "test@example.com"
        mock_user.hashed_password = hash_password("StrongPass1")
        mock_user.is_active = False
        mock_user_repo.get_by_email.return_value = mock_user
        
        with pytest.raises(HTTPException) as exc_info:
            await login_user(
                "test@example.com",
                "StrongPass1",
                mock_user_repo,
            )
        
        assert exc_info.value.status_code == 403


class TestRefreshToken:
    """refresh_access_token servis testleri."""

    @pytest.mark.asyncio
    async def test_refresh_access_token_success(self) -> None:
        """Geçerli refresh token ile access token yenilenmeli."""
        mock_user_repo = AsyncMock()
        
        user_id = uuid.uuid4()
        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user.email = "test@example.com"
        mock_user_repo.get_by_id.return_value = mock_user
        
        # Create valid refresh token
        refresh_token = create_refresh_token({
            "user_id": str(user_id),
            "email": "test@example.com",
            "token_type": "refresh",
        })
        
        result = await refresh_access_token(refresh_token, mock_user_repo)
        assert result.access_token is not None

    @pytest.mark.asyncio
    async def test_refresh_access_token_invalid(self) -> None:
        """Geçersiz refresh token ile 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        with pytest.raises(HTTPException) as exc_info:
            await refresh_access_token("invalid-token", mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_access_token_wrong_type(self) -> None:
        """Access token refresh olarak kullanılamaz."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        user_id = uuid.uuid4()
        access_token = create_access_token({
            "user_id": str(user_id),
            "email": "test@example.com",
            "token_type": "access",
        })
        
        with pytest.raises(HTTPException) as exc_info:
            await refresh_access_token(access_token, mock_user_repo)
        
        assert exc_info.value.status_code == 401


class TestGetCurrentUser:
    """get_current_user servis testleri."""

    @pytest.mark.asyncio
    async def test_get_current_user_success(self) -> None:
        """Geçerli token ile kullanıcı alınmalı."""
        mock_user_repo = AsyncMock()
        
        user_id = uuid.uuid4()
        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user_repo.get_by_id.return_value = mock_user
        
        # Create valid token
        token = create_access_token({
            "user_id": str(user_id),
            "email": "test@example.com",
            "token_type": "access",
        })
        
        result = await get_current_user(token, mock_user_repo)
        assert result == mock_user

    @pytest.mark.asyncio
    async def test_get_current_user_invalid_token(self) -> None:
        """Geçersiz token ile 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user("invalid-token", mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_get_current_user_not_found(self) -> None:
        """Token geçerli ama kullanıcı yoksa 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        mock_user_repo.get_by_id.return_value = None
        
        user_id = uuid.uuid4()
        token = create_access_token({
            "user_id": str(user_id),
            "email": "test@example.com",
            "token_type": "access",
        })
        
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token, mock_user_repo)
        
        assert exc_info.value.status_code == 401


    @pytest.mark.asyncio
    async def test_refresh_access_token_invalid_user_id_type(self) -> None:
        """user_id string değilse 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Create token with invalid user_id type
        payload = {
            "user_id": 12345,  # int instead of str
            "email": "test@example.com",
            "token_type": "refresh",
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        with pytest.raises(HTTPException) as exc_info:
            await refresh_access_token(token, mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_access_token_invalid_uuid_format(self) -> None:
        """user_id geçersiz UUID formatında ise 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Create token with invalid UUID format
        payload = {
            "user_id": "not-a-valid-uuid",
            "email": "test@example.com",
            "token_type": "refresh",
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        with pytest.raises(HTTPException) as exc_info:
            await refresh_access_token(token, mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_access_token_user_not_found(self) -> None:
        """Refresh token geçerli ama kullanıcı yoksa 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        mock_user_repo.get_by_id.return_value = None
        
        user_id = uuid.uuid4()
        refresh_token = create_refresh_token({
            "user_id": str(user_id),
            "email": "test@example.com",
            "token_type": "refresh",
        })
        
        with pytest.raises(HTTPException) as exc_info:
            await refresh_access_token(refresh_token, mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_get_current_user_invalid_user_id_type(self) -> None:
        """user_id string değilse 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Create token with invalid user_id type
        payload = {
            "user_id": 12345,  # int instead of str
            "email": "test@example.com",
            "token_type": "access",
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token, mock_user_repo)
        
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_get_current_user_invalid_uuid_format(self) -> None:
        """user_id geçersiz UUID formatında ise 401 fırlatılmalı."""
        from fastapi import HTTPException
        
        mock_user_repo = AsyncMock()
        
        # Create token with invalid UUID format
        payload = {
            "user_id": "not-a-valid-uuid",
            "email": "test@example.com",
            "token_type": "access",
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token, mock_user_repo)
        
        assert exc_info.value.status_code == 401
