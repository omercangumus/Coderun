# Coderun backend — ders Pydantic şemaları; API giriş/çıkış doğrulaması için.

from __future__ import annotations

import uuid

from pydantic import BaseModel, ConfigDict

from app.schemas.gamification import BadgeResponse
from app.schemas.question import QuestionResponse


class LessonBase(BaseModel):
    """Ders şemalarının ortak alanlarını tanımlar."""

    title: str
    lesson_type: str
    order: int
    xp_reward: int


class LessonResponse(LessonBase):
    """API yanıtlarında ders bilgilerini döndürmek için şema.

    Attributes:
        id: Dersin benzersiz UUID'si.
        module_id: Dersin ait olduğu modülün UUID'si.
        is_active: Dersin aktif olup olmadığı.
    """

    id: uuid.UUID
    module_id: uuid.UUID
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class LessonWithProgressResponse(LessonResponse):
    """Kullanıcının ilerleme bilgisiyle birlikte ders şeması.

    Attributes:
        is_completed: Kullanıcının bu dersi tamamlayıp tamamlamadığı.
        is_locked: Önceki ders tamamlanmadan bu ders kilitli mi.
        score: Kullanıcının bu dersten aldığı puan (None ise hiç denenmemiş).
        attempt_count: Kullanıcının bu dersi kaç kez denediği.
    """

    is_completed: bool = False
    is_locked: bool = False
    score: int | None = None
    attempt_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class LessonDetailResponse(LessonResponse):
    """Ders detay yanıtı; sorular dahil.

    Attributes:
        questions: Derse ait soru listesi (correct_answer içermez).
    """

    questions: list[QuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)


class LessonResultResponse(BaseModel):
    """Ders cevap gönderimi sonucunu döndüren şema.

    Attributes:
        lesson_id: Cevaplanan dersin UUID'si.
        score: Hesaplanan puan (0–100).
        correct_count: Doğru cevap sayısı.
        wrong_count: Yanlış cevap sayısı.
        xp_earned: Kazanılan XP miktarı (streak bonusu dahil).
        is_completed: Ders tamamlandı mı (skor >= eşik değeri).
        level_up: Seviye atlandı mı.
        new_level: Güncel seviye.
        new_streak: Güncel streak değeri.
        badges_earned: Bu işlemde kazanılan rozetler.
        message: Kullanıcıya gösterilecek mesaj.
    """

    lesson_id: uuid.UUID
    score: int
    correct_count: int
    wrong_count: int
    xp_earned: int
    is_completed: bool
    level_up: bool = False
    new_level: int = 1
    new_streak: int = 0
    badges_earned: list[BadgeResponse] = []
    message: str

    model_config = ConfigDict(from_attributes=True)
