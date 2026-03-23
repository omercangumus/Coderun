# Coderun backend — soru repository katmanı; Question modeli üzerinde CRUD ve özel sorgular.

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.lesson import Lesson
from backend.app.models.question import Question
from backend.app.repositories.base_repository import BaseRepository


class QuestionRepository(BaseRepository[Question]):
    """Question modeli için repository sınıfı.

    BaseRepository'nin generic CRUD operasyonlarına ek olarak
    derse göre soru listeleme ve seviye testi için rastgele
    soru çekme metodlarını sağlar.
    """

    def __init__(self, session: AsyncSession) -> None:
        """QuestionRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, Question)

    async def get_by_lesson(self, lesson_id: UUID) -> list[Question]:
        """Derse ait soruları sıra numarasına göre döner.

        Args:
            lesson_id: Soruların ait olduğu dersin UUID'si.

        Returns:
            Question nesnelerinin sıralı listesi.
        """
        result = await self._session.execute(
            select(Question)
            .where(Question.lesson_id == lesson_id)
            .order_by(Question.order)
        )
        return list(result.scalars().all())

    async def get_random_by_module(
        self,
        module_id: UUID,
        limit: int = 15,
    ) -> list[Question]:
        """Seviye testi için modülden rastgele soru çeker.

        Modüle ait tüm aktif derslerden rastgele soru seçer.
        func.random() ile veritabanı düzeyinde rastgelelik sağlanır.

        Args:
            module_id: Soruların çekileceği modülün UUID'si.
            limit: Döndürülecek maksimum soru sayısı.

        Returns:
            Rastgele seçilmiş Question nesnelerinin listesi.
        """
        result = await self._session.execute(
            select(Question)
            .join(Lesson, Lesson.id == Question.lesson_id)
            .where(
                Lesson.module_id == module_id,
                Lesson.is_active.is_(True),
            )
            .order_by(func.random())
            .limit(limit)
        )
        return list(result.scalars().all())
