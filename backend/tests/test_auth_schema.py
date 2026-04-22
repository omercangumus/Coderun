# Coderun backend — auth schema validation testleri.

import pytest
from pydantic import ValidationError

from app.schemas.auth import UserCreate, TokenResponse, RefreshTokenRequest, TokenData


class TestUserCreate:
    """UserCreate şeması için testler."""

    def test_user_create_valid(self) -> None:
        """Geçerli verilerle UserCreate oluşturulabilir."""
        user = UserCreate(
            email="test@example.com",
            username="testuser",
            password="StrongPass1",
        )
        assert user.email == "test@example.com"
        assert user.username == "testuser"
        assert user.password == "StrongPass1"

    def test_user_create_password_no_uppercase(self) -> None:
        """Büyük harf içermeyen şifre hata vermeli."""
        with pytest.raises(ValidationError) as exc_info:
            UserCreate(
                email="test@example.com",
                username="testuser",
                password="weakpass1",
            )
        assert "büyük harf" in str(exc_info.value).lower()

    def test_user_create_password_no_digit(self) -> None:
        """Rakam içermeyen şifre hata vermeli."""
        with pytest.raises(ValidationError) as exc_info:
            UserCreate(
                email="test@example.com",
                username="testuser",
                password="WeakPass",
            )
        assert "rakam" in str(exc_info.value).lower()

    def test_user_create_password_too_short(self) -> None:
        """8 karakterden kısa şifre hata vermeli."""
        with pytest.raises(ValidationError):
            UserCreate(
                email="test@example.com",
                username="testuser",
                password="Short1",
            )

    def test_user_create_invalid_email(self) -> None:
        """Geçersiz email hata vermeli."""
        with pytest.raises(ValidationError):
            UserCreate(
                email="invalid-email",
                username="testuser",
                password="StrongPass1",
            )

    def test_user_create_username_too_short(self) -> None:
        """3 karakterden kısa kullanıcı adı hata vermeli."""
        with pytest.raises(ValidationError):
            UserCreate(
                email="test@example.com",
                username="ab",
                password="StrongPass1",
            )

    def test_user_create_username_invalid_chars(self) -> None:
        """Geçersiz karakter içeren kullanıcı adı hata vermeli."""
        with pytest.raises(ValidationError):
            UserCreate(
                email="test@example.com",
                username="test-user!",
                password="StrongPass1",
            )


class TestTokenResponse:
    """TokenResponse şeması için testler."""

    def test_token_response_creation(self) -> None:
        """TokenResponse oluşturulabilir."""
        token = TokenResponse(
            access_token="access123",
            refresh_token="refresh456",
            expires_in=3600,
        )
        assert token.access_token == "access123"
        assert token.refresh_token == "refresh456"
        assert token.token_type == "bearer"
        assert token.expires_in == 3600


class TestRefreshTokenRequest:
    """RefreshTokenRequest şeması için testler."""

    def test_refresh_token_request_creation(self) -> None:
        """RefreshTokenRequest oluşturulabilir."""
        request = RefreshTokenRequest(refresh_token="token123")
        assert request.refresh_token == "token123"


class TestTokenData:
    """TokenData şeması için testler."""

    def test_token_data_creation(self) -> None:
        """TokenData oluşturulabilir."""
        from uuid import uuid4
        
        user_id = uuid4()
        token_data = TokenData(
            user_id=user_id,
            email="test@example.com",
        )
        assert token_data.user_id == user_id
        assert token_data.email == "test@example.com"

    def test_token_data_optional_fields(self) -> None:
        """TokenData opsiyonel alanlarla oluşturulabilir."""
        token_data = TokenData()
        assert token_data.user_id is None
        assert token_data.email is None
