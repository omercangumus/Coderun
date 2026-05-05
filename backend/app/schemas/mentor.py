# Coderun backend — AI Mentor Pydantic şemaları.

from enum import Enum

from pydantic import BaseModel, Field


class MentorContext(str, Enum):
    """Mentor sohbet bağlamı."""

    LESSON = "lesson"    # Ders sırasında soru
    LAB = "lab"          # Lab ortamında yardım
    GENERAL = "general"  # Genel soru


class ChatMessage(BaseModel):
    """Tek bir sohbet mesajı."""

    role: str    # "user" veya "assistant"
    content: str


class MentorRequest(BaseModel):
    """AI Mentor sohbet isteği."""

    message: str = Field(..., min_length=1, max_length=1000)
    context: MentorContext = MentorContext.GENERAL
    history: list[ChatMessage] = Field(default=[], max_length=10)
    lesson_title: str | None = None
    module_slug: str | None = None   # "python" | "devops" | "cloud"
    question_text: str | None = None


class MentorResponse(BaseModel):
    """AI Mentor sohbet yanıtı."""

    reply: str
    context: MentorContext
