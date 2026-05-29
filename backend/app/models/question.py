# Coderun backend — soru ORM modeli.
# Bir derse ait bireysel soruları temsil eder.

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import JSON, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.lesson import Lesson

# Geçerli soru türleri
QUESTION_TYPES = (
    "multiple_choice",
    "code_completion",
    "code_editor",
    "fill_in_blank",
    "reorder",
    "true_false_reason",
    "spot_the_bug",
    "multi_select",
)


class Question(BaseModel):
    """Bir derse ait soruyu temsil eden ORM modeli.

    Attributes:
        lesson_id: Sorunun bağlı olduğu dersin UUID'si.
        question_type: Soru türü — multiple_choice, fill_in_blank, reorder, vb.
        question_text: Sorunun metni.
        options: Çoktan seçmeli / multi_select / true_false_reason seçenekleri (JSON).
        correct_answer: Doğru cevap metni veya kodu.
        hint: Kullanıcıya gösterilecek ipucu (opsiyonel).
        explanation: Yanlış cevap sonrası gösterilen açıklama (opsiyonel).
        code_block: Kod tabanlı sorular için kod snippet'i (opsiyonel).
        word_bank: fill_in_blank / code_completion için kelime bankası (JSON).
        correct_line_index: spot_the_bug için hatalı satır indeksi (opsiyonel).
        order: Ders içindeki sıralama indeksi.
        reinforcement_question_id: Bu soru yanlış cevaplanınca gösterilecek
            pekiştirme sorusunun UUID'si (self-referential, opsiyonel).
        lesson: Sorunun ait olduğu ders (back_populates).
        reinforcement_question: Pekiştirme sorusu ilişkisi.
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
    explanation: Mapped[str | None] = mapped_column(String, nullable=True)
    code_block: Mapped[str | None] = mapped_column(String, nullable=True)
    word_bank: Mapped[dict[str, object] | None] = mapped_column(JSON, nullable=True)
    correct_line_index: Mapped[int | None] = mapped_column(Integer, nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    reinforcement_question_id: Mapped[UUID | None] = mapped_column(
        PgUUID(as_uuid=True),
        ForeignKey("questions.id"),
        nullable=True,
    )
    is_reinforcement: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # --- Code Assignment Fields (code_editor type) ---
    language: Mapped[str | None] = mapped_column(
        String, nullable=True, server_default="python"
    )
    starter_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    test_cases: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    assignment_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    max_runtime_ms: Mapped[int | None] = mapped_column(
        Integer, nullable=True, server_default="5000"
    )
    memory_limit_mb: Mapped[int | None] = mapped_column(
        Integer, nullable=True, server_default="128"
    )

    lesson: Mapped[Lesson] = relationship("Lesson", back_populates="questions")
    reinforcement_question: Mapped[Question | None] = relationship(
        "Question",
        remote_side="Question.id",
        foreign_keys=[reinforcement_question_id],
        lazy="joined",
        join_depth=1,
    )
