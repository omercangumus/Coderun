# Coderun backend — kullanıcı ilerleme ORM modeli.
# Bir kullanıcının belirli bir dersteki tamamlama durumunu ve skorunu takip eder.

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.models.base import BaseModel


class UserProgress(BaseModel):
    """Kullanıcının bir dersteki ilerleme kaydını temsil eden ORM modeli.

    Her (user_id, lesson_id) çifti benzersizdir; aynı kullanıcı aynı ders için
    yalnızca tek bir ilerleme kaydına sahip olabilir.

    Attributes:
        user_id: İlerleme kaydının sahibi olan kullanıcının UUID'si.
        lesson_id: İlerlemenin takip edildiği dersin UUID'si.
        is_completed: Dersin tamamlanıp tamamlanmadığı.
        score: Kullanıcının bu dersten aldığı puan.
        attempt_count: Kullanıcının bu dersi kaç kez denediği.
        completed_at: Dersin tamamlandığı zaman damgası (UTC).
    """

    __tablename__ = "user_progress"

    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_user_progress_user_lesson"),
    )

    user_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True),
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )
    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True),
        ForeignKey("lessons.id"),
        index=True,
        nullable=False,
    )
    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    attempt_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
