# Coderun backend — ders ORM modeli.
# Bir modül içindeki bireysel dersleri temsil eder; quiz, kod tamamlama vb.

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSON, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.module import Module
    from app.models.question import Question

# Geçerli ders türleri
LESSON_TYPES = ("quiz", "code_completion", "code_editor", "mini_project")


class Lesson(BaseModel):
    """Bir modüle ait dersi temsil eden ORM modeli.

    Attributes:
        module_id: Dersin bağlı olduğu modülün UUID'si.
        title: Dersin başlığı.
        lesson_type: Ders türü — quiz, code_completion, code_editor veya mini_project.
        content: Dersin JSON formatındaki içeriği (sorular, açıklamalar vb.).
        order: Modül içindeki sıralama indeksi.
        xp_reward: Dersi tamamlayan kullanıcıya verilecek XP miktarı.
        is_active: Dersin aktif olup olmadığı.
        module: Dersin ait olduğu modül (back_populates).
        questions: Derse ait sorular (lazy loaded).
    """

    __tablename__ = "lessons"

    module_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("modules.id"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    lesson_type: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False)
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    module: Mapped[Module] = relationship("Module", back_populates="lessons")
    questions: Mapped[list[Question]] = relationship(
        "Question",
        back_populates="lesson",
        order_by="Question.order",
        lazy="select",
    )
