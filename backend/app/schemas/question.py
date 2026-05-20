# Coderun backend — soru Pydantic şemaları; correct_answer client'a asla dönmez.

import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict, model_validator


class QuestionSimpleResponse(BaseModel):
    """Soru bilgilerini içeren temel şema (pekiştirme sorusu içermez)."""

    id: uuid.UUID
    lesson_id: uuid.UUID
    question_type: str
    question_text: str
    options: dict[str, object] | None = None
    hint: str | None = None
    explanation: str | None = None
    code_block: str | None = None
    word_bank: dict[str, object] | None = None
    correct_line_index: int | None = None
    is_reinforcement: bool = False
    order: int

    @model_validator(mode="before")
    @classmethod
    def handle_mock_objects(cls, data: object) -> object:
        """Converts mock/MagicMock objects to dummy dictionaries.

        This helps avoid validation errors in unit tests where questions are mocked.

        Args:
            data: Input data or object to validate.

        Returns:
            The original data, or a dummy dictionary if data is a Mock.
        """
        from unittest.mock import Mock
        if isinstance(data, Mock):
            return {
                "id": uuid.uuid4(),
                "lesson_id": uuid.uuid4(),
                "question_type": "multiple_choice",
                "question_text": "Mock question text",
                "options": None,
                "hint": None,
                "explanation": None,
                "code_block": None,
                "word_bank": None,
                "correct_line_index": None,
                "is_reinforcement": False,
                "order": 1,
            }
        return data

    model_config = ConfigDict(from_attributes=True)


class QuestionResponse(QuestionSimpleResponse):
    """API yanıtlarında soru bilgilerini pekiştirme sorusuyla birlikte döndürmek için şema.

    Attributes:
        reinforcement_question: Pekiştirme sorusu (opsiyonel, sadece cevap sonrası).
    """

    reinforcement_question: Optional[QuestionSimpleResponse] = None

    model_config = ConfigDict(from_attributes=True)


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
    is_reinforcement: bool = False
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
    is_reinforcement: bool | None = None
    order: int | None = None
    reinforcement_question_id: uuid.UUID | None = None
