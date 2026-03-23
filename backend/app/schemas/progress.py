# Coderun backend — ilerleme ve seviye testi Pydantic şemaları.

import uuid

from pydantic import BaseModel, ConfigDict

from backend.app.schemas.question import QuestionResponse


class AnswerSubmit(BaseModel):
    """Kullanıcının bir soruya verdiği cevabı temsil eden şema.

    Attributes:
        question_id: Cevaplanan sorunun UUID'si.
        answer: Kullanıcının verdiği cevap metni.
    """

    question_id: uuid.UUID
    answer: str


class PlacementTestResponse(BaseModel):
    """Seviye testi sorularını döndüren şema.

    Attributes:
        module_id: Testin ait olduğu modülün UUID'si.
        module_title: Modülün başlığı.
        questions: Soru listesi (correct_answer içermez).
        total_questions: Toplam soru sayısı.
    """

    module_id: uuid.UUID
    module_title: str
    questions: list[QuestionResponse]
    total_questions: int

    model_config = ConfigDict(from_attributes=True)


class PlacementResultResponse(BaseModel):
    """Seviye testi sonucunu ve yerleştirme bilgisini döndüren şema.

    Attributes:
        correct_count: Doğru cevap sayısı.
        total_count: Toplam soru sayısı.
        percentage: Doğru cevap yüzdesi (0.0–100.0).
        starting_lesson_order: Kullanıcının başlayacağı dersin sıra numarası.
        skipped_lessons: Otomatik tamamlanan ders sayısı.
        message: Kullanıcıya gösterilecek yerleştirme mesajı.
    """

    correct_count: int
    total_count: int
    percentage: float
    starting_lesson_order: int
    skipped_lessons: int
    message: str

    model_config = ConfigDict(from_attributes=True)
