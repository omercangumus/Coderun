# Coderun backend — API v1 bağımlılık sağlayıcıları.

from __future__ import annotations

from collections.abc import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.database import AsyncSessionLocal
from backend.app.models.user import User
from backend.app.repositories.badge_repository import BadgeRepository
from backend.app.repositories.lesson_repository import LessonRepository
from backend.app.repositories.module_repository import ModuleRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.repositories.question_repository import QuestionRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.services.auth_service import get_current_user as resolve_current_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """API istekleri için async veritabanı oturumu sağlar.

    Her istek için yeni bir AsyncSession açar; istek tamamlandığında
    oturumu kapatır. Herhangi bir istisna durumunda rollback uygular.

    Yields:
        AsyncSession: Aktif veritabanı oturumu.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


async def get_user_repository(
    db: AsyncSession = Depends(get_db),
) -> UserRepository:
    """UserRepository bağımlılığını sağlar."""
    return UserRepository(db)


async def get_progress_repository(
    db: AsyncSession = Depends(get_db),
) -> ProgressRepository:
    """ProgressRepository bağımlılığını sağlar."""
    return ProgressRepository(db)


async def get_module_repository(
    db: AsyncSession = Depends(get_db),
) -> ModuleRepository:
    """ModuleRepository bağımlılığını sağlar."""
    return ModuleRepository(db)


async def get_lesson_repository(
    db: AsyncSession = Depends(get_db),
) -> LessonRepository:
    """LessonRepository bağımlılığını sağlar."""
    return LessonRepository(db)


async def get_question_repository(
    db: AsyncSession = Depends(get_db),
) -> QuestionRepository:
    """QuestionRepository bağımlılığını sağlar."""
    return QuestionRepository(db)


async def get_badge_repository(
    db: AsyncSession = Depends(get_db),
) -> BadgeRepository:
    """BadgeRepository bağımlılığını sağlar."""
    return BadgeRepository(db)


async def get_redis() -> Redis | None:
    """Redis client bağımlılığını sağlar.

    Global Redis client'ı döner. Redis bağlantısı yoksa None döner;
    çağıran kod None kontrolü yapmalıdır.
    """
    from backend.app.core.redis import get_redis as _get_redis  # noqa: PLC0415
    gen = _get_redis()
    try:
        client = await gen.__anext__()
        return client
    except StopAsyncIteration:
        return None
    finally:
        await gen.aclose()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repository),
) -> User:
    """Bearer token'dan aktif kullanıcıyı çözümler."""
    return await resolve_current_user(token, user_repo)


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Yalnızca aktif kullanıcıları kabul eder."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=settings.AUTH_INVALID_CREDENTIALS_MESSAGE,
        )
    return current_user
