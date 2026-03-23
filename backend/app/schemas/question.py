# Coderun backend — soru Pydantic şemaları; correct_answer client'a asla dönmez.

import uuid

from pydantic import BaseModel, ConfigDict


class QuestionResponse(BaseModel):
    """API yanıtlarında soru bilgilerini döndürmek için şema.

    Attributes:
        id: Sorunun benzersiz UUID'si.
        lesson_id: Sorunun ait olduğu dersin UUID'si.
        question_type: Soru türü (multiple_choice, code_completion, code_editor).
        question_text: Sorunun metni.
        options: Çoktan seçmeli sorular için seçenekler; diğerleri için None.
        order: Ders içindeki sıralama indeksi.

    Note:
        correct_answer bu şemada YOK — client'a asla gönderilmez.
    """

    id: uuid.UUID
    lesson_id: uuid.UUID
    question_type: str
    question_text: str
    options: dict | None = None
    order: int

    model_config = ConfigDict(from_attributes=True)


class QuestionWithAnswerResponse(QuestionResponse):
    """Doğru cevabı da içeren soru şeması.

    Sadece servis içi kullanım içindir; hiçbir endpoint bu şemayı
    doğrudan döndürmemelidir.

    Attributes:
        correct_answer: Sorunun doğru cevabı.
    """

    correct_answer: str

    model_config = ConfigDict(from_attributes=True)
