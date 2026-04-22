# Module service unit testleri — get_module_progress_by_slug ve diğer fonksiyonlar.

from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.services import module_service


@pytest.mark.asyncio
class TestGetAllModules:
    """get_all_modules() fonksiyonu testleri."""

    async def test_get_all_modules_returns_list(self, db_session):
        """Tüm aktif modülleri döndürür."""
        from app.repositories.module_repository import ModuleRepository

        module_repo = ModuleRepository(db_session)
        modules = await module_service.get_all_modules(module_repo)

        assert isinstance(modules, list)
        assert len(modules) == 3  # Seed data: python, devops, cloud
        assert all(m.slug in ["python", "devops", "cloud"] for m in modules)


@pytest.mark.asyncio
class TestGetModuleDetail:
    """get_module_detail() fonksiyonu testleri."""

    async def test_get_module_detail_returns_lessons(self, db_session):
        """Slug ile modül detayını derslerle birlikte döndürür."""
        from app.repositories.module_repository import ModuleRepository

        module_repo = ModuleRepository(db_session)
        module = await module_service.get_module_detail("python", module_repo)

        assert module.slug == "python"
        assert module.title == "Python"
        assert len(module.lessons) == 5  # Seed data: 5 ders

    async def test_get_module_detail_not_found(self, db_session):
        """Olmayan slug için 404 döner."""
        from app.repositories.module_repository import ModuleRepository

        module_repo = ModuleRepository(db_session)

        with pytest.raises(HTTPException) as exc_info:
            await module_service.get_module_detail("nonexistent", module_repo)

        assert exc_info.value.status_code == 404
        assert "bulunamadı" in exc_info.value.detail.lower()


@pytest.mark.asyncio
class TestGetModuleProgress:
    """get_module_progress() fonksiyonu testleri."""

    async def test_get_module_progress_returns_completion_rate(
        self, db_session, test_user
    ):
        """Kullanıcının modül ilerlemesini döndürür."""
        from app.repositories.lesson_repository import LessonRepository
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.user_repository import UserRepository

        user_repo = UserRepository(db_session)
        module_repo = ModuleRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        # Test kullanıcısı oluştur
        user = await user_repo.get_by_email(test_user["email"])
        assert user is not None

        # Python modülünü bul
        python_module = await module_repo.get_by_slug("python")
        assert python_module is not None

        # İlerleme bilgisini al
        progress = await module_service.get_module_progress(
            python_module.id, user.id, module_repo, progress_repo, lesson_repo
        )

        assert progress.module.slug == "python"
        assert progress.completion_rate == 0.0  # Henüz ders tamamlanmamış
        assert progress.completed_lessons == 0
        assert progress.total_lessons == 5

    async def test_get_module_progress_not_found(self, db_session, test_user):
        """Olmayan modül için 404 döner."""
        from app.repositories.lesson_repository import LessonRepository
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.user_repository import UserRepository

        user_repo = UserRepository(db_session)
        module_repo = ModuleRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        user = await user_repo.get_by_email(test_user["email"])
        assert user is not None

        fake_module_id = uuid4()

        with pytest.raises(HTTPException) as exc_info:
            await module_service.get_module_progress(
                fake_module_id, user.id, module_repo, progress_repo, lesson_repo
            )

        assert exc_info.value.status_code == 404


@pytest.mark.asyncio
class TestGetModuleProgressBySlug:
    """get_module_progress_by_slug() fonksiyonu testleri."""

    async def test_get_module_progress_by_slug_returns_progress(
        self, db_session, test_user
    ):
        """Slug ile modül ilerlemesini döndürür."""
        from app.repositories.lesson_repository import LessonRepository
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.user_repository import UserRepository

        user_repo = UserRepository(db_session)
        module_repo = ModuleRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        user = await user_repo.get_by_email(test_user["email"])
        assert user is not None

        progress = await module_service.get_module_progress_by_slug(
            "python", user.id, module_repo, progress_repo, lesson_repo
        )

        assert progress.module.slug == "python"
        assert progress.completion_rate >= 0.0
        assert progress.total_lessons == 5

    async def test_get_module_progress_by_slug_not_found(
        self, db_session, test_user
    ):
        """Olmayan slug için 404 döner."""
        from app.repositories.lesson_repository import LessonRepository
        from app.repositories.module_repository import ModuleRepository
        from app.repositories.progress_repository import ProgressRepository
        from app.repositories.user_repository import UserRepository

        user_repo = UserRepository(db_session)
        module_repo = ModuleRepository(db_session)
        progress_repo = ProgressRepository(db_session)
        lesson_repo = LessonRepository(db_session)

        user = await user_repo.get_by_email(test_user["email"])
        assert user is not None

        with pytest.raises(HTTPException) as exc_info:
            await module_service.get_module_progress_by_slug(
                "nonexistent", user.id, module_repo, progress_repo, lesson_repo
            )

        assert exc_info.value.status_code == 404
