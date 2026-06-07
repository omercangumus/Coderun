# Coderun backend — LLM Mentor şemaları (httpx tabanlı servis için).

from __future__ import annotations

from pydantic import BaseModel, Field


class LlmMentorRequest(BaseModel):
    """LLM Mentor sohbet isteği."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Kullanıcının sorusu veya mesajı.",
    )
    user_level: str = Field(
        default="beginner",
        description="Kullanıcı seviyesi: beginner, intermediate, advanced.",
        examples=["beginner", "intermediate", "advanced"],
    )
    learning_path: str | None = Field(
        default=None,
        description="Öğrenme yolu: python, devops, cloud, iac.",
        examples=["python", "devops", "cloud", "iac"],
    )
    attempt_count: int = Field(
        default=1,
        ge=1,
        description="Kullanıcının bu soruyu kaçıncı kez sorduğu. 1=ilk ipucu, 2=daha açık, 3+=örnek.",
    )
    question_text: str | None = Field(
        default=None,
        max_length=8000,
        description="Kullanıcının çözdüğü quiz sorusunun metni.",
    )
    lesson_title: str | None = Field(
        default=None,
        max_length=500,
        description="Ders başlığı (ör. Python Hızlı Pratik).",
    )
    question_type: str | None = Field(
        default=None,
        description="Soru tipi: multiple_choice, code_completion vb.",
    )
    code_block: str | None = Field(
        default=None,
        max_length=4000,
        description="Kod tamamlama sorusundaki kod bloğu.",
    )


class LlmMentorResponse(BaseModel):
    """LLM Mentor sohbet yanıtı."""

    answer: str = Field(description="Mentor'un yanıtı.")
