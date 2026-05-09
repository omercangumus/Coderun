# Coderun backend — soru Pydantic şemaları; correct_answer client'a asla dönmez.

import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict


class QuestionResponse(BaseModel):
    """API yanıtlarında soru bilgilerini döndürmek için şema.

    Attributes:
        id: Sorunun benzersiz UUID'si.
        lesson_id: Sorunun ait olduğu dersin UUID'si.
        question_type: Soru türü.
        question_text: Sorunun metni.
        options: Seçenekler (JSON); geçerli olmayan türler için None.
        hint: İpucu metni (opsiyonel).
        code_block: Kod snippet'i (opsiyonel).
        word_bank: Kelime bankası (opsiyonel).
        correct_line_index: Hatalı satır indeksi — sadece spot_the_bug (opsiyonel).
        order: Ders içindeki sıralama indeksi.
        reinforcement_question: Pekiştirme sorusu (opsiyonel, sadece cevap sonrası).

    Note:
        correct_answer bu şemada YOK — client'a asla gönderilmez.
    """

    id: uuid.UUID
    lesson_id: uuid.UUID
    question_type: str
    question_text: str
    options: dict[str, object] | None = None
    hint: str | None = None
    code_block: str | None = None
    word_bank: dict[str, object] | None = None
    order: int
    reinforcement_question: Optional["QuestionResponse"] = None

    model_config = ConfigDict(from_attributes=True)


# Forward reference çözümlemesi
QuestionResponse.model_rebuild()


class QuestionWithAnswerResponse(QuestionResponse):
    """Doğru cevabı da içeren soru şeması.

    Sadece servis içi kullanım içindir; hiçbir endpoint bu şemayı
    doğrudan döndürmemelidir.

    Attributes:
        correct_answer: Sorunun doğru cevabı.
        explanation: Yanlış cevap sonrası açıklama.
        correct_line_index: Hatalı satır indeksi (spot_the_bug).
    """

    correct_answer: str
    explanation: str | None = None
    correct_line_index: int | None = None

    model_config = ConfigDict(from_attributes=True)


class QuestionCreateSchema(BaseModel):
    """Admin panelinden soru oluşturmak için şema."""

    lesson_id: uuid.UUID
    question_type: str
    question_text: str
    options: dict[str, object] | None = None
    correct_answer: str
    hint: str | None = None
    explanation: str | None = None
    code_block: str | None = None
    word_bank: dict[str, object] | None = None
    correct_line_index: int | None = None
    order: int = 0
    reinforcement_question_id: uuid.UUID | None = None


class QuestionUpdateSchema(BaseModel):
    """Admin panelinden soru güncellemek için şema."""

    question_type: str | None = None
    question_text: str | None = None
    options: dict[str, object] | None = None
    correct_answer: str | None = None
    hint: str | None = None
    explanation: str | None = None
    code_block: str | None = None
    word_bank: dict[str, object] | None = None
    correct_line_index: int | None = None
    order: int | None = None
    reinforcement_question_id: uuid.UUID | None = None
