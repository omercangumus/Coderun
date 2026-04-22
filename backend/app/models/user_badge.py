# Coderun backend — kullanıcı rozeti ORM modeli.
# Kullanıcıların kazandığı başarı rozetlerini takip eder.

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.models.base import BaseModel

# Geçerli rozet türleri
BADGE_TYPES = (
    "first_lesson",
    "streak_7",
    "streak_30",
    "module_complete",
    "level_5",
    "level_10",
)


class UserBadge(BaseModel):
    """Kullanıcının kazandığı rozeti temsil eden ORM modeli.

    Attributes:
        user_id: Rozeti kazanan kullanıcının UUID'si.
        badge_type: Rozet türü (örn. first_lesson, streak_7, module_complete).
        earned_at: Rozetin kazanıldığı zaman damgası (UTC).
    """

    __tablename__ = "user_badges"

    user_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True),
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )
    badge_type: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
