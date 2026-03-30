# Coderun backend — rozet repository katmanı; UserBadge modeli üzerinde CRUD ve özel sorgular.

from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.user_badge import UserBadge
from backend.app.repositories.base_repository import BaseRepository
from backend.app.schemas.gamification import BadgeType


class BadgeRepository(BaseRepository[UserBadge]):
    """UserBadge modeli için repository sınıfı.

    Rozet sorgulama, verme ve kontrol metodlarını sağlar.
    Rozet işlemleri idempotent'tir; aynı rozet iki kez verilmez.
    """

    def __init__(self, session: AsyncSession) -> None:
        """BadgeRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, UserBadge)

    async def get_user_badges(self, user_id: UUID) -> list[UserBadge]:
        """Kullanıcının tüm rozetlerini kazanılma tarihine göre sıralı döner.

        Args:
            user_id: Kullanıcının UUID'si.

        Returns:
            UserBadge nesnelerinin listesi.
        """
        result = await self._session.execute(
            select(UserBadge)
            .where(UserBadge.user_id == user_id)
            .order_by(UserBadge.earned_at.desc())
        )
        return list(result.scalars().all())

    async def has_badge(self, user_id: UUID, badge_type: BadgeType) -> bool:
        """Kullanıcının belirli bir rozete sahip olup olmadığını kontrol eder.

        Args:
            user_id: Kullanıcının UUID'si.
            badge_type: Kontrol edilecek rozet türü.

        Returns:
            Rozet mevcutsa True, değilse False.
        """
        result = await self._session.execute(
            select(UserBadge).where(
                UserBadge.user_id == user_id,
                UserBadge.badge_type == badge_type,
            )
        )
        return result.scalars().first() is not None

    async def award_badge(self, user_id: UUID, badge_type: BadgeType) -> UserBadge:
        """Kullanıcıya rozet verir; zaten varsa mevcut rozeti döner (idempotent).

        Args:
            user_id: Rozeti kazanacak kullanıcının UUID'si.
            badge_type: Verilecek rozet türü.

        Returns:
            Yeni oluşturulan veya mevcut UserBadge nesnesi.
        """
        existing = await self._session.execute(
            select(UserBadge).where(
                UserBadge.user_id == user_id,
                UserBadge.badge_type == badge_type,
            )
        )
        badge = existing.scalars().first()
        if badge is not None:
            return badge

        try:
            new_badge = UserBadge(
                user_id=user_id,
                badge_type=badge_type,
                earned_at=datetime.now(timezone.utc),
            )
            self._session.add(new_badge)
            await self._session.flush()
            return new_badge
        except Exception:
            await self._session.rollback()
            raise

    async def get_users_badge_count(self, user_id: UUID) -> int:
        """Kullanıcının toplam rozet sayısını döner.

        Args:
            user_id: Kullanıcının UUID'si.

        Returns:
            Toplam rozet sayısı.
        """
        result = await self._session.execute(
            select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
        )
        return result.scalar_one()
