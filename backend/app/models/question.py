# Coderun backend — soru ORM modeli.
# Bir derse ait bireysel soruları temsil eder.

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSON, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.models.base import BaseModel

if TYPE_CHECKING:
    from backend.app.models.lesson import Lesson

# Geçerli soru türleri
QUESTION_TYPES = ("multiple_choice", "code_completion", "code_editor")


class Question(BaseModel):
    """Bir derse ait soruyu temsil eden ORM modeli.

    Attributes:
        lesson_id: Sorunun bağlı olduğu dersin UUID'si.
        question_type: Soru türü — multiple_choice, code_completion veya code_editor.
        question_text: Sorunun metni.
        options: Çoktan seçmeli sorular için seçenekler (JSON); diğer türler için None.
        correct_answer: Doğru cevap metni veya kodu.
        hint: Kullanıcıya gösterilecek ipucu (opsiyonel).
        order: Ders içindeki sıralama indeksi.
        lesson: Sorunun ait olduğu ders (back_populates).
    """

    __tablename__ = "questions"

    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("lessons.id"), index=True, nullable=False
    )
    question_type: Mapped[str] = mapped_column(String, nullable=False)
    question_text: Mapped[str] = mapped_column(String, nullable=False)
    options: Mapped[dict[str, object] | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[str] = mapped_column(String, nullable=False)
    hint: Mapped[str | None] = mapped_column(String, nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    lesson: Mapped[Lesson] = relationship("Lesson", back_populates="questions")
