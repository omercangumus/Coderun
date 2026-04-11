# Coderun backend — auth endpoint'leri (kayıt, giriş, token yenileme, profil, çıkış).

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.api.v1.dependencies import (
    get_current_active_user,
    get_user_repository,
)
from backend.app.models.user import User
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.auth import RefreshTokenRequest, TokenResponse, UserCreate
from backend.app.schemas.user import UserResponse
from backend.app.services.auth_service import (
    login_user,
    refresh_access_token,
    register_user,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_create: UserCreate,
    user_repo: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    """Yeni kullanıcı kaydı oluşturur.

    Args:
        user_create: Kayıt bilgileri (email, username, password).
        user_repo: Kullanıcı repository bağımlılığı.

    Returns:
        Oluşturulan kullanıcının profil bilgisi.
    """
    created_user = await register_user(user_create=user_create, user_repo=user_repo)
    logger.info("New user registered: %s", created_user.username)
    return created_user


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_repo: UserRepository = Depends(get_user_repository),
) -> TokenResponse:
    """OAuth2 form verisiyle kullanıcı girişi yapar.

    Args:
        form_data: OAuth2 form verisi (username=email, password).
        user_repo: Kullanıcı repository bağımlılığı.

    Returns:
        Access ve refresh token çifti.
    """
    return await login_user(
        email=form_data.username,
        password=form_data.password,
        user_repo=user_repo,
    )


@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh(
    payload: RefreshTokenRequest,
    user_repo: UserRepository = Depends(get_user_repository),
) -> TokenResponse:
    """Body içindeki refresh token ile yeni access token üretir.

    Args:
        payload: Refresh token içeren istek gövdesi.
        user_repo: Kullanıcı repository bağımlılığı.

    Returns:
        Yeni access token ve mevcut refresh token.
    """
    return await refresh_access_token(
        refresh_token=payload.refresh_token,
        user_repo=user_repo,
    )


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def me(
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    """Token sahibinin profil bilgisini döndürür.

    Auth gerekir.

    Args:
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Kullanıcı profil bilgisi.
    """
    return UserResponse.model_validate(current_user)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    current_user: User = Depends(get_current_active_user),
) -> dict[str, str]:
    """Kullanıcı oturumunu kapatır.

    Auth gerekir. Token client tarafında silinmeli.
    Sunucu tarafı blacklist ilerleyen sürümde Redis ile eklenecek.

    Args:
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Başarı mesajı.
    """
    # TODO: Redis blacklist ile token invalidation eklenecek.
    logger.info("User logged out: %s", current_user.username)
    return {"message": "Çıkış başarılı"}
