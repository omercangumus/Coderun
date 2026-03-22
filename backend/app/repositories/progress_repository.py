# Coderun backend — kullanıcı ilerleme repository katmanı; UserProgress modeli üzerinde CRUD ve özel sorgular.

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.lesson import Lesson
from backend.app.models.user_progress import UserProgress
from backend.app.repositories.base_repository import BaseRepository


class ProgressRepository(BaseRepository[UserProgress]):
    """UserProgress modeli için repository sınıfı.

    BaseRepository'nin generic CRUD operasyonlarına ek olarak
    ders/modül bazlı ilerleme sorgulama ve tamamlanan ders sayısı
    hesaplama metodlarını sağlar.

    Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
    """

    def __init__(self, session: AsyncSession) -> None:
        """ProgressRepository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
        """
        super().__init__(session, UserProgress)

    async def get_user_lesson_progress(
        self,
        user_id: UUID,
        lesson_id: UUID,
    ) -> UserProgress | None:
        """Belirli bir kullanıcının belirli bir dersteki ilerleme kaydını döner.

        Args:
            user_id: Kullanıcının UUID'si.
            lesson_id: Dersin UUID'si.

        Returns:
            Bulunan UserProgress nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(UserProgress).where(
                UserProgress.user_id == user_id,
                UserProgress.lesson_id == lesson_id,
            )
        )
        return result.scalars().first()

    async def get_user_module_progress(
        self,
        user_id: UUID,
        module_id: UUID,
    ) -> list[UserProgress]:
        """Belirli bir kullanıcının belirli bir modüldeki tüm ders ilerlemelerini döner.

        Modüle ait dersleri Lesson tablosu üzerinden join yaparak filtreler.

        Args:
            user_id: Kullanıcının UUID'si.
            module_id: Modülün UUID'si.

        Returns:
            Modüle ait UserProgress nesnelerinin listesi.
        """
        result = await self._session.execute(
            select(UserProgress)
            .join(Lesson, Lesson.id == UserProgress.lesson_id)
            .where(
                UserProgress.user_id == user_id,
                Lesson.module_id == module_id,
            )
        )
        return list(result.scalars().all())

    async def get_completed_lessons_count(self, user_id: UUID) -> int:
        """Kullanıcının tamamladığı ders sayısını döner.

        Args:
            user_id: Kullanıcının UUID'si.

        Returns:
            Tamamlanan ders sayısı.
        """
        result = await self._session.execute(
            select(func.count()).where(
                UserProgress.user_id == user_id,
                UserProgress.is_completed.is_(True),
            )
        )
        return result.scalar_one()
