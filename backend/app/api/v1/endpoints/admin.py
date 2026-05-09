# Coderun backend — admin endpoint'leri; superuser guard ile korunan CRUD API'leri.

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies import get_current_superuser, get_db
from app.models.user import User
from app.schemas.admin import (
    AdminStatsResponse,
    LessonAdminListItem,
    LessonCreateSchema,
    LessonUpdateSchema,
    PathCreateSchema,
    PathListItem,
    PathUpdateSchema,
    ReorderRequest,
    UnitCreateSchema,
    UnitListItem,
    UnitUpdateSchema,
    UserAdminListItem,
    UserProgressDetail,
)
from app.schemas.question import (
    QuestionCreateSchema,
    QuestionUpdateSchema,
    QuestionWithAnswerResponse,
)
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["admin"])


# ---------------------------------------------------------------------------
# Dashboard Stats
# ---------------------------------------------------------------------------


@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> AdminStatsResponse:
    """Admin dashboard istatistikleri."""
    return await admin_service.get_admin_stats(db)


# ---------------------------------------------------------------------------
# Learning Paths (Modules)
# ---------------------------------------------------------------------------


@router.get("/paths", response_model=list[PathListItem])
async def list_paths(
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> list[PathListItem]:
    """Tüm learning path'leri listeler."""
    return await admin_service.get_paths(db)


@router.post("/paths", response_model=PathListItem, status_code=status.HTTP_201_CREATED)
async def create_path(
    data: PathCreateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> PathListItem:
    """Yeni learning path oluşturur."""
    module = await admin_service.create_path(db, data.model_dump())
    return PathListItem(
        id=module.id,
        title=module.title,
        slug=module.slug,
        description=module.description,
        order=module.order,
        is_active=module.is_active,
        is_published=module.is_published,
    )


@router.put("/paths/{path_id}", response_model=PathListItem)
async def update_path(
    path_id: UUID,
    data: PathUpdateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> PathListItem:
    """Learning path günceller."""
    module = await admin_service.update_path(db, path_id, data.model_dump(exclude_unset=True))
    if module is None:
        raise HTTPException(status_code=404, detail="Path bulunamadı")
    return PathListItem(
        id=module.id,
        title=module.title,
        slug=module.slug,
        description=module.description,
        order=module.order,
        is_active=module.is_active,
        is_published=module.is_published,
    )


@router.delete("/paths/{path_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_path(
    path_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> None:
    """Learning path siler."""
    if not await admin_service.delete_path(db, path_id):
        raise HTTPException(status_code=404, detail="Path bulunamadı")


@router.patch("/paths/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_paths(
    data: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> None:
    """Learning path'leri yeniden sıralar."""
    await admin_service.reorder_paths(db, [i.model_dump() for i in data.items])


# ---------------------------------------------------------------------------
# Units
# ---------------------------------------------------------------------------


@router.get("/units", response_model=list[UnitListItem])
async def list_units(
    module_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> list[UnitListItem]:
    """Modüle ait üniteleri listeler."""
    return await admin_service.get_units(db, module_id)


@router.post("/units", response_model=UnitListItem, status_code=status.HTTP_201_CREATED)
async def create_unit(
    data: UnitCreateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> UnitListItem:
    """Yeni ünite oluşturur."""
    unit = await admin_service.create_unit(db, data.model_dump())
    return UnitListItem(
        id=unit.id,
        module_id=unit.module_id,
        title=unit.title,
        description=unit.description,
        order=unit.order,
        is_active=unit.is_active,
    )


@router.put("/units/{unit_id}", response_model=UnitListItem)
async def update_unit(
    unit_id: UUID,
    data: UnitUpdateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> UnitListItem:
    """Ünite günceller."""
    unit = await admin_service.update_unit(db, unit_id, data.model_dump(exclude_unset=True))
    if unit is None:
        raise HTTPException(status_code=404, detail="Ünite bulunamadı")
    return UnitListItem(
        id=unit.id,
        module_id=unit.module_id,
        title=unit.title,
        description=unit.description,
        order=unit.order,
        is_active=unit.is_active,
    )


@router.delete("/units/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_unit(
    unit_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> None:
    """Ünite siler."""
    if not await admin_service.delete_unit(db, unit_id):
        raise HTTPException(status_code=404, detail="Ünite bulunamadı")


# ---------------------------------------------------------------------------
# Lessons
# ---------------------------------------------------------------------------


@router.get("/lessons", response_model=list[LessonAdminListItem])
async def list_lessons(
    module_id: UUID | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> list[LessonAdminListItem]:
    """Dersleri admin istatistikleriyle listeler."""
    return await admin_service.get_lessons_admin(db, module_id)


@router.post("/lessons", response_model=LessonAdminListItem, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    data: LessonCreateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> LessonAdminListItem:
    """Yeni ders oluşturur."""
    lesson = await admin_service.create_lesson(db, data.model_dump())
    return LessonAdminListItem(
        id=lesson.id,
        module_id=lesson.module_id,
        unit_id=lesson.unit_id,
        title=lesson.title,
        lesson_type=lesson.lesson_type,
        order=lesson.order,
        xp_reward=lesson.xp_reward,
        is_active=lesson.is_active,
    )


@router.put("/lessons/{lesson_id}", response_model=LessonAdminListItem)
async def update_lesson(
    lesson_id: UUID,
    data: LessonUpdateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> LessonAdminListItem:
    """Ders günceller."""
    lesson = await admin_service.update_lesson(db, lesson_id, data.model_dump(exclude_unset=True))
    if lesson is None:
        raise HTTPException(status_code=404, detail="Ders bulunamadı")
    return LessonAdminListItem(
        id=lesson.id,
        module_id=lesson.module_id,
        unit_id=lesson.unit_id,
        title=lesson.title,
        lesson_type=lesson.lesson_type,
        order=lesson.order,
        xp_reward=lesson.xp_reward,
        is_active=lesson.is_active,
    )


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    lesson_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> None:
    """Ders siler."""
    if not await admin_service.delete_lesson(db, lesson_id):
        raise HTTPException(status_code=404, detail="Ders bulunamadı")


# ---------------------------------------------------------------------------
# Questions
# ---------------------------------------------------------------------------


@router.get("/questions", response_model=list[QuestionWithAnswerResponse])
async def list_questions(
    lesson_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> list[QuestionWithAnswerResponse]:
    """Derse ait soruları listeler (correct_answer dahil — sadece admin)."""
    questions = await admin_service.get_questions_admin(db, lesson_id)
    return [QuestionWithAnswerResponse.model_validate(q) for q in questions]


@router.post(
    "/questions", response_model=QuestionWithAnswerResponse, status_code=status.HTTP_201_CREATED
)
async def create_question(
    data: QuestionCreateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> QuestionWithAnswerResponse:
    """Yeni soru oluşturur."""
    question = await admin_service.create_question(db, data.model_dump())
    return QuestionWithAnswerResponse.model_validate(question)


@router.put("/questions/{question_id}", response_model=QuestionWithAnswerResponse)
async def update_question(
    question_id: UUID,
    data: QuestionUpdateSchema,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> QuestionWithAnswerResponse:
    """Soru günceller."""
    question = await admin_service.update_question(
        db, question_id, data.model_dump(exclude_unset=True)
    )
    if question is None:
        raise HTTPException(status_code=404, detail="Soru bulunamadı")
    return QuestionWithAnswerResponse.model_validate(question)


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> None:
    """Soru siler."""
    if not await admin_service.delete_question(db, question_id):
        raise HTTPException(status_code=404, detail="Soru bulunamadı")


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


@router.get("/users", response_model=list[UserAdminListItem])
async def list_users(
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> list[UserAdminListItem]:
    """Kullanıcıları listeler (arama destekli)."""
    return await admin_service.get_users_admin(db, search, skip, limit)


@router.get("/users/{user_id}/progress", response_model=UserProgressDetail)
async def get_user_progress(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_superuser),
) -> UserProgressDetail:
    """Kullanıcının ilerleme detayını getirir."""
    return await admin_service.get_user_progress_detail(db, user_id)
