# Coderun backend — kullanıcı repository katmanı; User modeli üzerinde CRUD ve özel sorgular.

from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """User modeli için repository sınıfı.

    BaseRepository'nin generic CRUD operasyonlarına ek olarak
    e-posta/kullanıcı adı ile arama, XP ve streak güncelleme
    metodlarını sağlar.
    """

    def __init__(self, session: AsyncSession) -> None:
        """UserRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, User)

    async def get_by_email(self, email: str) -> User | None:
        """E-posta adresine göre kullanıcı arar.

        Args:
            email: Aranacak e-posta adresi.

        Returns:
            Bulunan User nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()

    async def get_by_username(self, username: str) -> User | None:
        """Kullanıcı adına göre kullanıcı arar.

        Args:
            username: Aranacak kullanıcı adı.

        Returns:
            Bulunan User nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(User).where(User.username == username)
        )
        return result.scalars().first()

    async def update_xp(self, user_id: UUID, xp: int) -> User:
        """Kullanıcının XP değerini günceller.

        Args:
            user_id: XP'si güncellenecek kullanıcının UUID'si.
            xp: Yeni XP değeri.

        Returns:
            Güncellenmiş User nesnesi.

        Raises:
            ValueError: Kullanıcı bulunamazsa fırlatılır.
            Exception: Veritabanı hatası durumunda rollback yapılır ve hata yeniden fırlatılır.
        """
        user = await self.update(user_id, {"xp": xp})
        if user is None:
            raise ValueError(f"User not found: {user_id}")
        return user

    async def update_streak(
        self,
        user_id: UUID,
        streak: int,
        last_active: date,
    ) -> User:
        """Kullanıcının streak ve son aktif tarih bilgisini günceller.

        Args:
            user_id: Streak'i güncellenecek kullanıcının UUID'si.
            streak: Yeni streak değeri (ardışık aktif gün sayısı).
            last_active: Kullanıcının son aktif olduğu tarih.

        Returns:
            Güncellenmiş User nesnesi.

        Raises:
            ValueError: Kullanıcı bulunamazsa fırlatılır.
            Exception: Veritabanı hatası durumunda rollback yapılır ve hata yeniden fırlatılır.
        """
        user = await self.update(
            user_id,
            {"streak": streak, "last_active_date": last_active},
        )
        if user is None:
            raise ValueError(f"User not found: {user_id}")
        return user
