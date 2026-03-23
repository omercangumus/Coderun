# Coderun backend — modül repository katmanı; Module modeli üzerinde CRUD ve özel sorgular.

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.app.models.module import Module
from backend.app.repositories.base_repository import BaseRepository


class ModuleRepository(BaseRepository[Module]):
    """Module modeli için repository sınıfı.

    BaseRepository'nin generic CRUD operasyonlarına ek olarak
    aktif modül listeleme, slug ile arama ve derslerle birlikte
    getirme metodlarını sağlar.
    """

    def __init__(self, session: AsyncSession) -> None:
        """ModuleRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, Module)

    async def get_all_active(self, skip: int = 0, limit: int = 10) -> list[Module]:
        """Aktif modülleri sıra numarasına göre döner.

        Args:
            skip: Atlanacak kayıt sayısı.
            limit: Döndürülecek maksimum kayıt sayısı.

        Returns:
            is_active=True olan Module nesnelerinin sıralı listesi.
        """
        result = await self._session.execute(
            select(Module)
            .where(Module.is_active.is_(True))
            .order_by(Module.order)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Module | None:
        """Slug değerine göre modül arar.

        Args:
            slug: Aranacak modül slug'ı (örn. "python", "devops", "cloud").

        Returns:
            Bulunan Module nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(Module).where(Module.slug == slug)
        )
        return result.scalars().first()

    async def get_with_lessons(self, module_id: UUID) -> Module | None:
        """Modülü aktif dersleriyle birlikte getirir.

        Dersler order alanına göre sıralanır.

        Args:
            module_id: Getirilecek modülün UUID'si.

        Returns:
            Dersleri yüklenmiş Module nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(Module)
            .options(joinedload(Module.lessons))
            .where(Module.id == module_id)
        )
        return result.unique().scalars().first()
