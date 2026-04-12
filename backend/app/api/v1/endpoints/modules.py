# Coderun backend — modül endpoint'leri; modül listeleme ve detay API'leri.


from fastapi import APIRouter, Depends

from backend.app.api.v1.dependencies import (
    get_current_active_user,
    get_lesson_repository,
    get_module_repository,
    get_progress_repository,
)
from backend.app.models.user import User
from backend.app.repositories.lesson_repository import LessonRepository
from backend.app.repositories.module_repository import ModuleRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.schemas.module import (
    ModuleDetailResponse,
    ModuleProgressResponse,
    ModuleResponse,
)
from backend.app.services import module_service

router = APIRouter(prefix="/modules", tags=["modules"])


@router.get("", response_model=list[ModuleResponse])
async def list_modules(
    module_repo: ModuleRepository = Depends(get_module_repository),
) -> list[ModuleResponse]:
    """Tüm aktif modülleri listeler.

    Auth gerekmez. Modüller sıra numarasına göre döner.

    Args:
        module_repo: Modül repository bağımlılığı.

    Returns:
        Aktif modüllerin listesi.
    """
    return await module_service.get_all_modules(module_repo)


# DİKKAT: /{slug}/progress route'u /{slug}'dan ÖNCE tanımlanmalı.
# Aksi hâlde FastAPI "progress" string'ini slug parametresi olarak yakalar.
@router.get("/{slug}/progress", response_model=ModuleProgressResponse)
async def get_module_progress(
    slug: str,
    module_repo: ModuleRepository = Depends(get_module_repository),
    progress_repo: ProgressRepository = Depends(get_progress_repository),
    lesson_repo: LessonRepository = Depends(get_lesson_repository),
    current_user: User = Depends(get_current_active_user),
) -> ModuleProgressResponse:
    """Kullanıcının bir modüldeki ilerleme bilgisini döner.

    Auth gerekir. Mobile app slug gönderiyor, bu yüzden slug ile module bulup progress getiriyoruz.

    Args:
        slug: Modülün slug'ı (örn: "python-basics").
        module_repo: Modül repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.
        lesson_repo: Ders repository bağımlılığı.
        current_user: Kimliği doğrulanmış aktif kullanıcı.

    Returns:
        Modül bilgisi ve tamamlama oranı.
    """
    return await module_service.get_module_progress_by_slug(
        slug, current_user.id, module_repo, progress_repo, lesson_repo
    )


@router.get("/{slug}", response_model=ModuleDetailResponse)
async def get_module(
    slug: str,
    module_repo: ModuleRepository = Depends(get_module_repository),
) -> ModuleDetailResponse:
    """Slug ile modül detayını derslerle birlikte getirir.

    Auth gerekmez.

    Args:
        slug: Modülün URL dostu tanımlayıcısı.
        module_repo: Modül repository bağımlılığı.

    Returns:
        Dersleri dahil modül detay bilgisi.
    """
    return await module_service.get_module_detail(slug, module_repo)
