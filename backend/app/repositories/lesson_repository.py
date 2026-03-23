# Coderun backend — ders repository katmanı; Lesson modeli üzerinde CRUD ve özel sorgular.

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.app.models.lesson import Lesson
from backend.app.repositories.base_repository import BaseRepository


class LessonRepository(BaseRepository[Lesson]):
    """Lesson modeli için repository sınıfı.

    BaseRepository'nin generic CRUD operasyonlarına ek olarak
    modüle göre ders listeleme, sıra ile getirme ve sorularla
    birlikte yükleme metodlarını sağlar.
    """

    def __init__(self, session: AsyncSession) -> None:
        """LessonRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, Lesson)

    async def get_by_module(
        self,
        module_id: UUID,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Lesson]:
        """Modüle ait aktif dersleri sıra numarasına göre döner.

        Args:
            module_id: Derslerin ait olduğu modülün UUID'si.
            skip: Atlanacak kayıt sayısı.
            limit: Döndürülecek maksimum kayıt sayısı.

        Returns:
            is_active=True olan Lesson nesnelerinin sıralı listesi.
        """
        result = await self._session.execute(
            select(Lesson)
            .where(
                Lesson.module_id == module_id,
                Lesson.is_active.is_(True),
            )
            .order_by(Lesson.order)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_module_and_order(
        self,
        module_id: UUID,
        order: int,
    ) -> Lesson | None:
        """Modül içinde belirli sıradaki dersi döner.

        Args:
            module_id: Modülün UUID'si.
            order: Dersin sıra numarası.

        Returns:
            Bulunan Lesson nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(Lesson).where(
                Lesson.module_id == module_id,
                Lesson.order == order,
                Lesson.is_active.is_(True),
            )
        )
        return result.scalars().first()

    async def get_with_questions(self, lesson_id: UUID) -> Lesson | None:
        """Dersi soruları ile birlikte getirir.

        Sorular order alanına göre sıralanır.

        Args:
            lesson_id: Getirilecek dersin UUID'si.

        Returns:
            Soruları yüklenmiş Lesson nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(Lesson)
            .options(joinedload(Lesson.questions))
            .where(Lesson.id == lesson_id)
        )
        return result.unique().scalars().first()

    async def get_next_lesson(
        self,
        module_id: UUID,
        current_order: int,
    ) -> Lesson | None:
        """Mevcut dersin bir sonraki aktif dersini döner.

        Args:
            module_id: Modülün UUID'si.
            current_order: Mevcut dersin sıra numarası.

        Returns:
            Bir sonraki Lesson nesnesi ya da ``None`` (son ders ise).
        """
        result = await self._session.execute(
            select(Lesson)
            .where(
                Lesson.module_id == module_id,
                Lesson.order > current_order,
                Lesson.is_active.is_(True),
            )
            .order_by(Lesson.order)
            .limit(1)
        )
        return result.scalars().first()

    async def count_by_module(self, module_id: UUID) -> int:
        """Modüldeki aktif ders sayısını döner.

        Args:
            module_id: Modülün UUID'si.

        Returns:
            Aktif ders sayısı.
        """
        from sqlalchemy import func

        result = await self._session.execute(
            select(func.count()).where(
                Lesson.module_id == module_id,
                Lesson.is_active.is_(True),
            )
        )
        return result.scalar_one()
