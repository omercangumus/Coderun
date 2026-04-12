# Coderun backend — kayıt, giriş, token yenileme ve mevcut kullanıcı çözümleme iş mantığı.

from __future__ import annotations

from datetime import timedelta
from typing import Protocol
from uuid import UUID

from fastapi import HTTPException, status

from backend.app.core.config import settings
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from backend.app.models.user import User
from backend.app.schemas.auth import TokenResponse, UserCreate
from backend.app.schemas.user import UserResponse


class UserRepositoryProtocol(Protocol):
    """Auth servisinin ihtiyaç duyduğu repository kontratı."""

    async def get_by_email(self, email: str) -> User | None:
        """E-posta ile kullanıcı döndürür."""

    async def get_by_username(self, username: str) -> User | None:
        """Kullanıcı adı ile kullanıcı döndürür."""

    async def create(self, obj_in: dict[str, object]) -> User:
        """Yeni kullanıcı oluşturur."""

    async def get_by_id(self, id: UUID) -> User | None:
        """UUID ile kullanıcı döndürür."""


async def register_user(
    user_create: UserCreate,
    user_repo: UserRepositoryProtocol,
) -> UserResponse:
    """Yeni kullanıcı kaydeder ve güvenli kullanıcı yanıtı döndürür."""
    existing_email = await user_repo.get_by_email(user_create.email)
    if existing_email is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kullanımda",
        )

    existing_username = await user_repo.get_by_username(user_create.username)
    if existing_username is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu kullanıcı adı zaten kullanımda",
        )

    created_user = await user_repo.create(
        {
            "email": user_create.email,
            "username": user_create.username,
            "hashed_password": hash_password(user_create.password),
        }
    )
    return UserResponse.model_validate(created_user)


async def login_user(
    email: str,
    password: str,
    user_repo: UserRepositoryProtocol,
) -> TokenResponse:
    """Kimlik bilgilerini doğrular ve access/refresh token üretir."""
    user = await user_repo.get_by_email(email)
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    token_payload = {"user_id": str(user.id), "email": user.email}
    access_token = create_access_token({**token_payload, "token_type": "access"})
    refresh_token = create_refresh_token({**token_payload, "token_type": "refresh"})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def refresh_access_token(
    refresh_token: str,
    user_repo: UserRepositoryProtocol,
) -> TokenResponse:
    """Geçerli refresh token ile yeni access token üretir."""
    payload = decode_token(refresh_token)
    if payload is None or payload.get("token_type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    user_id = payload.get("user_id")
    if not isinstance(user_id, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    try:
        parsed_user_id = UUID(user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        ) from exc

    user = await user_repo.get_by_id(parsed_user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    access_token = create_access_token(
        {"user_id": str(user.id), "email": user.email, "token_type": "access"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def get_current_user(
    token: str,
    user_repo: UserRepositoryProtocol,
) -> User:
    """Bearer token'dan kullanıcıyı çözümler ve döndürür."""
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    user_id = payload.get("user_id")
    if not isinstance(user_id, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )

    try:
        parsed_user_id = UUID(user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        ) from exc

    user = await user_repo.get_by_id(parsed_user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )
    return user
