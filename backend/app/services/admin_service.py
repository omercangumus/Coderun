# Coderun backend — admin servis katmanı; istatistik, CRUD ve kullanıcı yönetimi.

from datetime import date, datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lesson import Lesson
from app.models.module import Module
from app.models.question import Question
from app.models.unit import Unit
from app.models.user import User
from app.models.user_badge import UserBadge
from app.models.user_progress import UserProgress
from app.schemas.admin import (
    AdminStatsResponse,
    GrowthDataPoint,
    LessonAdminListItem,
    PathListItem,
    UnitListItem,
    UserAdminListItem,
    UserProgressDetail,
)


# ---------------------------------------------------------------------------
# Dashboard Stats
# ---------------------------------------------------------------------------


async def get_admin_stats(db: AsyncSession) -> AdminStatsResponse:
    """Admin dashboard istatistiklerini hesaplar."""
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)

    # Total users
    total_users_q = await db.execute(select(func.count(User.id)))
    total_users = total_users_q.scalar() or 0

    # Active today
    active_today_q = await db.execute(
        select(func.count(User.id)).where(User.last_active_date == today)
    )
    active_today = active_today_q.scalar() or 0

    # Lessons completed today
    completed_today_q = await db.execute(
        select(func.count(UserProgress.id)).where(
            and_(
                UserProgress.is_completed == True,  # noqa: E712
                UserProgress.completed_at >= today_start,
            )
        )
    )
    lessons_completed_today = completed_today_q.scalar() or 0

    # Growth data — last 7 days
    growth_data: list[GrowthDataPoint] = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time()).replace(tzinfo=timezone.utc)
        day_end = day_start + timedelta(days=1)
        count_q = await db.execute(
            select(func.count(User.id)).where(
                and_(User.created_at >= day_start, User.created_at < day_end)
            )
        )
        count = count_q.scalar() or 0
        growth_data.append(GrowthDataPoint(day=day.strftime("%a"), count=count))

    return AdminStatsResponse(
        total_users=total_users,
        active_today=active_today,
        lessons_completed_today=lessons_completed_today,
        growth_data=growth_data,
    )


# ---------------------------------------------------------------------------
# Learning Paths (Modules) CRUD
# ---------------------------------------------------------------------------


async def get_paths(db: AsyncSession) -> list[PathListItem]:
    """Tüm learning path'leri (modülleri) listeler."""
    result = await db.execute(select(Module).order_by(Module.order))
    modules = result.scalars().all()

    items: list[PathListItem] = []
    for mod in modules:
        lesson_count_q = await db.execute(
            select(func.count(Lesson.id)).where(Lesson.module_id == mod.id)
        )
        lesson_count = lesson_count_q.scalar() or 0

        unit_count_q = await db.execute(
            select(func.count(Unit.id)).where(Unit.module_id == mod.id)
        )
        unit_count = unit_count_q.scalar() or 0

        items.append(
            PathListItem(
                id=mod.id,
                title=mod.title,
                slug=mod.slug,
                description=mod.description,
                order=mod.order,
                is_active=mod.is_active,
                is_published=mod.is_published,
                lesson_count=lesson_count,
                unit_count=unit_count,
            )
        )
    return items


async def create_path(db: AsyncSession, data: dict) -> Module:
    """Yeni learning path oluşturur."""
    module = Module(**data)
    db.add(module)
    await db.commit()
    await db.refresh(module)
    return module


async def update_path(db: AsyncSession, path_id: UUID, data: dict) -> Module | None:
    """Learning path günceller."""
    result = await db.execute(select(Module).where(Module.id == path_id))
    module = result.scalars().first()
    if module is None:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(module, key, value)
    await db.commit()
    await db.refresh(module)
    return module


async def delete_path(db: AsyncSession, path_id: UUID) -> bool:
    """Learning path siler."""
    result = await db.execute(select(Module).where(Module.id == path_id))
    module = result.scalars().first()
    if module is None:
        return False
    await db.delete(module)
    await db.commit()
    return True


async def reorder_paths(db: AsyncSession, items: list[dict]) -> None:
    """Learning path'leri yeniden sıralar."""
    for item in items:
        result = await db.execute(select(Module).where(Module.id == item["id"]))
        module = result.scalars().first()
        if module:
            module.order = item["order"]
    await db.commit()


# ---------------------------------------------------------------------------
# Units CRUD
# ---------------------------------------------------------------------------


async def get_units(db: AsyncSession, module_id: UUID) -> list[UnitListItem]:
    """Modüle ait üniteleri listeler."""
    result = await db.execute(
        select(Unit).where(Unit.module_id == module_id).order_by(Unit.order)
    )
    units = result.scalars().all()

    items: list[UnitListItem] = []
    for unit in units:
        lesson_count_q = await db.execute(
            select(func.count(Lesson.id)).where(Lesson.unit_id == unit.id)
        )
        lesson_count = lesson_count_q.scalar() or 0
        items.append(
            UnitListItem(
                id=unit.id,
                module_id=unit.module_id,
                title=unit.title,
                description=unit.description,
                order=unit.order,
                is_active=unit.is_active,
                lesson_count=lesson_count,
            )
        )
    return items


async def create_unit(db: AsyncSession, data: dict) -> Unit:
    """Yeni ünite oluşturur."""
    unit = Unit(**data)
    db.add(unit)
    await db.commit()
    await db.refresh(unit)
    return unit


async def update_unit(db: AsyncSession, unit_id: UUID, data: dict) -> Unit | None:
    """Ünite günceller."""
    result = await db.execute(select(Unit).where(Unit.id == unit_id))
    unit = result.scalars().first()
    if unit is None:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(unit, key, value)
    await db.commit()
    await db.refresh(unit)
    return unit


async def delete_unit(db: AsyncSession, unit_id: UUID) -> bool:
    """Ünite siler."""
    result = await db.execute(select(Unit).where(Unit.id == unit_id))
    unit = result.scalars().first()
    if unit is None:
        return False
    await db.delete(unit)
    await db.commit()
    return True


# ---------------------------------------------------------------------------
# Lessons CRUD (Admin)
# ---------------------------------------------------------------------------


async def get_lessons_admin(
    db: AsyncSession, module_id: UUID | None = None
) -> list[LessonAdminListItem]:
    """Dersleri admin istatistikleriyle listeler."""
    query = select(Lesson).order_by(Lesson.order)
    if module_id:
        query = query.where(Lesson.module_id == module_id)
    result = await db.execute(query)
    lessons = result.scalars().all()

    items: list[LessonAdminListItem] = []
    for lesson in lessons:
        # Question count
        q_count_q = await db.execute(
            select(func.count(Question.id)).where(Question.lesson_id == lesson.id)
        )
        question_count = q_count_q.scalar() or 0

        # Completion rate & avg score
        total_attempts_q = await db.execute(
            select(func.count(UserProgress.id)).where(
                UserProgress.lesson_id == lesson.id
            )
        )
        total_attempts = total_attempts_q.scalar() or 0

        completed_q = await db.execute(
            select(func.count(UserProgress.id)).where(
                and_(
                    UserProgress.lesson_id == lesson.id,
                    UserProgress.is_completed == True,  # noqa: E712
                )
            )
        )
        completed_count = completed_q.scalar() or 0

        avg_score_q = await db.execute(
            select(func.avg(UserProgress.score)).where(
                UserProgress.lesson_id == lesson.id
            )
        )
        avg_score = avg_score_q.scalar() or 0.0

        completion_rate = (completed_count / total_attempts * 100) if total_attempts > 0 else 0.0
        wrong_rate = 100.0 - float(avg_score) if total_attempts > 0 else 0.0

        items.append(
            LessonAdminListItem(
                id=lesson.id,
                module_id=lesson.module_id,
                unit_id=lesson.unit_id,
                title=lesson.title,
                lesson_type=lesson.lesson_type,
                order=lesson.order,
                xp_reward=lesson.xp_reward,
                is_active=lesson.is_active,
                completion_rate=round(completion_rate, 1),
                avg_score=round(float(avg_score), 1),
                wrong_rate=round(wrong_rate, 1),
                question_count=question_count,
            )
        )
    return items


async def create_lesson(db: AsyncSession, data: dict) -> Lesson:
    """Yeni ders oluşturur."""
    lesson = Lesson(content={}, **data)
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


async def update_lesson(db: AsyncSession, lesson_id: UUID, data: dict) -> Lesson | None:
    """Ders günceller."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalars().first()
    if lesson is None:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(lesson, key, value)
    await db.commit()
    await db.refresh(lesson)
    return lesson


async def delete_lesson(db: AsyncSession, lesson_id: UUID) -> bool:
    """Ders siler."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalars().first()
    if lesson is None:
        return False
    await db.delete(lesson)
    await db.commit()
    return True


# ---------------------------------------------------------------------------
# Questions CRUD (Admin)
# ---------------------------------------------------------------------------


async def get_questions_admin(db: AsyncSession, lesson_id: UUID) -> list[Question]:
    """Derse ait soruları listeler."""
    result = await db.execute(
        select(Question).where(Question.lesson_id == lesson_id).order_by(Question.order)
    )
    return list(result.scalars().all())


async def create_question(db: AsyncSession, data: dict) -> Question:
    """Yeni soru oluşturur."""
    question = Question(**data)
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question


async def update_question(db: AsyncSession, question_id: UUID, data: dict) -> Question | None:
    """Soru günceller."""
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalars().first()
    if question is None:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(question, key, value)
    await db.commit()
    await db.refresh(question)
    return question


async def delete_question(db: AsyncSession, question_id: UUID) -> bool:
    """Soru siler."""
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalars().first()
    if question is None:
        return False
    await db.delete(question)
    await db.commit()
    return True


# ---------------------------------------------------------------------------
# Users (Admin)
# ---------------------------------------------------------------------------


async def get_users_admin(
    db: AsyncSession, search: str | None = None, skip: int = 0, limit: int = 50
) -> list[UserAdminListItem]:
    """Kullanıcıları admin görünümüyle listeler."""
    query = select(User).order_by(User.created_at.desc())
    if search:
        query = query.where(
            User.username.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return [
        UserAdminListItem(
            id=u.id,
            username=u.username,
            email=u.email,
            xp=u.xp,
            level=u.level,
            streak=u.streak,
            is_active=u.is_active,
            is_superuser=u.is_superuser,
            created_at=u.created_at,
            last_active_date=u.last_active_date,
        )
        for u in users
    ]


async def get_user_progress_detail(
    db: AsyncSession, user_id: UUID
) -> UserProgressDetail:
    """Kullanıcının ilerleme detayını getirir."""
    user_q = await db.execute(select(User).where(User.id == user_id))
    user = user_q.scalars().first()

    completed_q = await db.execute(
        select(func.count(UserProgress.id)).where(
            and_(
                UserProgress.user_id == user_id,
                UserProgress.is_completed == True,  # noqa: E712
            )
        )
    )
    completed_lessons = completed_q.scalar() or 0

    total_lessons_q = await db.execute(select(func.count(Lesson.id)))
    total_lessons = total_lessons_q.scalar() or 0

    badge_count_q = await db.execute(
        select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
    )
    badge_count = badge_count_q.scalar() or 0

    return UserProgressDetail(
        user_id=user_id,
        completed_lessons=completed_lessons,
        total_lessons=total_lessons,
        total_xp=user.xp if user else 0,
        current_level=user.level if user else 1,
        current_streak=user.streak if user else 0,
        badge_count=badge_count,
    )
