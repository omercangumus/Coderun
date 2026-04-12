# Coderun backend — modül servis katmanı; modül iş mantığını yönetir.

from uuid import UUID

from fastapi import HTTPException, status

from backend.app.repositories.lesson_repository import LessonRepository
from backend.app.repositories.module_repository import ModuleRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.schemas.module import (
    ModuleDetailResponse,
    ModuleProgressResponse,
    ModuleResponse,
)


async def get_all_modules(module_repo: ModuleRepository) -> list[ModuleResponse]:
    """Tüm aktif modülleri sıralı olarak döner.

    Args:
        module_repo: Modül repository bağımlılığı.

    Returns:
        Aktif modüllerin listesi.
    """
    modules = await module_repo.get_all_active()
    return [ModuleResponse.model_validate(m) for m in modules]


async def get_module_detail(
    slug: str,
    module_repo: ModuleRepository,
) -> ModuleDetailResponse:
    """Slug ile modülü dersleriyle birlikte getirir.

    Args:
        slug: Modülün URL dostu tanımlayıcısı.
        module_repo: Modül repository bağımlılığı.

    Returns:
        Dersleri dahil modül detay bilgisi.

    Raises:
        HTTPException: Modül bulunamazsa 404 döner.
    """
    module = await module_repo.get_by_slug(slug)
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )
    module_with_lessons = await module_repo.get_with_lessons(module.id)
    if module_with_lessons is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )
    return ModuleDetailResponse.model_validate(module_with_lessons)


async def get_module_progress(
    module_id: UUID,
    user_id: UUID,
    module_repo: ModuleRepository,
    progress_repo: ProgressRepository,
    lesson_repo: LessonRepository,
) -> ModuleProgressResponse:
    """Kullanıcının bir modüldeki ilerleme bilgisini döner.

    Args:
        module_id: Modülün UUID'si.
        user_id: Kullanıcının UUID'si.
        module_repo: Modül repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        lesson_repo: Ders repository bağımlılığı.

    Returns:
        Modül bilgisi ve tamamlama oranını içeren yanıt.

    Raises:
        HTTPException: Modül bulunamazsa 404 döner.
    """
    module = await module_repo.get_by_id(module_id)
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )

    completion_rate = await progress_repo.get_module_completion_rate(user_id, module_id)
    user_progress_list = await progress_repo.get_user_module_progress(user_id, module_id)
    completed_lessons = sum(1 for p in user_progress_list if p.is_completed)

    # _session doğrudan erişimi yerine lesson_repo kullan
    total_lessons = await lesson_repo.count_by_module(module_id)

    return ModuleProgressResponse(
        module=ModuleResponse.model_validate(module),
        completion_rate=round(completion_rate * 100, 2),  # 0.0-1.0 → 0-100
        completed_lessons=completed_lessons,
        total_lessons=total_lessons,
    )


async def get_module_progress_by_slug(
    slug: str,
    user_id: UUID,
    module_repo: ModuleRepository,
    progress_repo: ProgressRepository,
    lesson_repo: LessonRepository,
) -> ModuleProgressResponse:
    """Kullanıcının bir modüldeki ilerleme bilgisini slug ile döner.

    Mobile app slug gönderiyor, bu yüzden önce slug ile module bulup sonra progress getiriyoruz.

    Args:
        slug: Modülün slug'ı (örn: "python-basics").
        user_id: Kullanıcının UUID'si.
        module_repo: Modül repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        lesson_repo: Ders repository bağımlılığı.

    Returns:
        Modül bilgisi ve tamamlama oranını içeren yanıt.

    Raises:
        HTTPException: Modül bulunamazsa 404 döner.
    """
    # Önce slug ile module'ü bul
    module = await module_repo.get_by_slug(slug)
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Modül bulunamadı",
        )

    # Sonra progress'i getir
    return await get_module_progress(
        module.id, user_id, module_repo, progress_repo, lesson_repo
    )
