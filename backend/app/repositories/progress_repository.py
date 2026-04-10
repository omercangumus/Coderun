# Coderun backend — kullanıcı ilerleme repository katmanı; UserProgress modeli üzerinde CRUD ve özel sorgular.

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.lesson import Lesson
from backend.app.models.module import Module
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

    async def get_module_completion_rate(
        self,
        user_id: UUID,
        module_id: UUID,
    ) -> float:
        """Kullanıcının bir modüldeki tamamlama oranını döner.

        Tamamlanan ders sayısını modüldeki toplam aktif ders sayısına böler.

        Args:
            user_id: Kullanıcının UUID'si.
            module_id: Modülün UUID'si.

        Returns:
            0.0 ile 1.0 arasında tamamlama oranı.
        """
        total_result = await self._session.execute(
            select(func.count(Lesson.id)).where(
                Lesson.module_id == module_id,
                Lesson.is_active.is_(True),
            )
        )
        total: int = total_result.scalar_one()
        if total == 0:
            return 0.0

        completed_result = await self._session.execute(
            select(func.count(UserProgress.id))
            .join(Lesson, Lesson.id == UserProgress.lesson_id)
            .where(
                UserProgress.user_id == user_id,
                Lesson.module_id == module_id,
                UserProgress.is_completed.is_(True),
            )
        )
        completed: int = completed_result.scalar_one()
        return completed / total

    async def get_user_stats(self, user_id: UUID) -> dict:
        """Kullanıcının genel istatistiklerini döner.

        Args:
            user_id: Kullanıcının UUID'si.

        Returns:
            Toplam tamamlanan ders, kazanılan XP, tamamlanan modül sayısı
            ve devam eden modül bilgisini içeren sözlük.
        """
        # Toplam tamamlanan ders sayısı
        stats_result = await self._session.execute(
            select(
                func.count(UserProgress.id).label("completed_lessons"),
            ).where(
                UserProgress.user_id == user_id,
                UserProgress.is_completed.is_(True),
            )
        )
        row = stats_result.one()
        completed_lessons: int = row.completed_lessons or 0

        # Tamamlanan modül sayısı: tüm dersleri tamamlanmış modüller
        completed_modules_result = await self._session.execute(
            select(func.count(Module.id)).where(
                ~Module.id.in_(  # type: ignore[attr-defined]
                    select(Lesson.module_id)
                    .outerjoin(
                        UserProgress,
                        (UserProgress.lesson_id == Lesson.id)
                        & (UserProgress.user_id == user_id)
                        & UserProgress.is_completed.is_(True),
                    )
                    .where(
                        Lesson.is_active.is_(True),
                        UserProgress.id.is_(None),  # type: ignore[attr-defined]
                    )
                    .distinct()
                ),
                Module.is_active.is_(True),
            )
        )
        completed_modules: int = completed_modules_result.scalar_one()

        # Devam eden modül: en son ilerleme kaydının modülü
        ongoing_result = await self._session.execute(
            select(Module.title)
            .join(Lesson, Lesson.module_id == Module.id)
            .join(UserProgress, UserProgress.lesson_id == Lesson.id)
            .where(
                UserProgress.user_id == user_id,
                UserProgress.is_completed.is_(False),
            )
            .order_by(UserProgress.updated_at.desc())  # type: ignore[attr-defined]
            .limit(1)
        )
        ongoing_module: str | None = ongoing_result.scalar_one_or_none()

        return {
            "completed_lessons": completed_lessons,
            "completed_modules": completed_modules,
            "ongoing_module": ongoing_module,
        }
