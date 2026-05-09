# Coderun backend — admin panel Pydantic şemaları.

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ---------------------------------------------------------------------------
# Dashboard Stats
# ---------------------------------------------------------------------------


class ProblemAreaItem(BaseModel):
    """Dashboard'da gösterilen problem alanı kartı."""
    title: str
    subtitle: str
    rate: float  # Yüzde (0-100)


class GrowthDataPoint(BaseModel):
    """Haftalık büyüme grafiği veri noktası."""
    day: str
    count: int


class AdminStatsResponse(BaseModel):
    """Admin dashboard istatistikleri."""
    total_users: int
    active_today: int
    lessons_completed_today: int
    most_failed_question: ProblemAreaItem | None = None
    most_skipped_lesson: ProblemAreaItem | None = None
    growth_data: list[GrowthDataPoint] = []


# ---------------------------------------------------------------------------
# Learning Paths (Modules)
# ---------------------------------------------------------------------------


class PathListItem(BaseModel):
    """Learning path liste öğesi."""
    id: uuid.UUID
    title: str
    slug: str
    description: str
    order: int
    is_active: bool
    is_published: bool
    lesson_count: int = 0
    unit_count: int = 0
    completion_rate: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class PathCreateSchema(BaseModel):
    """Yeni learning path oluşturma."""
    title: str
    slug: str
    description: str
    order: int = 0
    is_active: bool = True
    is_published: bool = False


class PathUpdateSchema(BaseModel):
    """Learning path güncelleme."""
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    order: int | None = None
    is_active: bool | None = None
    is_published: bool | None = None


class ReorderItem(BaseModel):
    """Sıralama güncelleme öğesi."""
    id: uuid.UUID
    order: int


class ReorderRequest(BaseModel):
    """Toplu sıralama güncelleme isteği."""
    items: list[ReorderItem]


# ---------------------------------------------------------------------------
# Units
# ---------------------------------------------------------------------------


class UnitListItem(BaseModel):
    """Ünite liste öğesi."""
    id: uuid.UUID
    module_id: uuid.UUID
    title: str
    description: str
    order: int
    is_active: bool
    lesson_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class UnitCreateSchema(BaseModel):
    """Yeni ünite oluşturma."""
    module_id: uuid.UUID
    title: str
    description: str = ""
    order: int = 0
    is_active: bool = True


class UnitUpdateSchema(BaseModel):
    """Ünite güncelleme."""
    title: str | None = None
    description: str | None = None
    order: int | None = None
    is_active: bool | None = None


# ---------------------------------------------------------------------------
# Lessons (Admin View)
# ---------------------------------------------------------------------------


class LessonAdminListItem(BaseModel):
    """Admin ders listesi öğesi — istatistik bilgileriyle birlikte."""
    id: uuid.UUID
    module_id: uuid.UUID
    unit_id: uuid.UUID | None = None
    title: str
    lesson_type: str
    order: int
    xp_reward: int
    is_active: bool
    completion_rate: float = 0.0
    avg_score: float = 0.0
    wrong_rate: float = 0.0
    question_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class LessonCreateSchema(BaseModel):
    """Admin'den ders oluşturma."""
    module_id: uuid.UUID
    unit_id: uuid.UUID | None = None
    title: str
    lesson_type: str
    order: int = 0
    xp_reward: int = 10
    is_active: bool = True


class LessonUpdateSchema(BaseModel):
    """Admin'den ders güncelleme."""
    title: str | None = None
    lesson_type: str | None = None
    unit_id: uuid.UUID | None = None
    order: int | None = None
    xp_reward: int | None = None
    is_active: bool | None = None


# ---------------------------------------------------------------------------
# Users (Admin View)
# ---------------------------------------------------------------------------


class UserAdminListItem(BaseModel):
    """Admin kullanıcı listesi öğesi."""
    id: uuid.UUID
    username: str
    email: str
    xp: int
    level: int
    streak: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    last_active_date: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserProgressDetail(BaseModel):
    """Kullanıcı ilerleme detayı."""
    user_id: uuid.UUID
    completed_lessons: int = 0
    total_lessons: int = 0
    total_xp: int = 0
    current_level: int = 1
    current_streak: int = 0
    badge_count: int = 0
