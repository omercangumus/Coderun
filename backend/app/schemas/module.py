# Coderun backend — modül Pydantic şemaları; API giriş/çıkış doğrulaması için.

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.app.schemas.lesson import LessonResponse


class ModuleBase(BaseModel):
    """Modül şemalarının ortak alanlarını tanımlar."""

    title: str
    slug: str
    description: str
    order: int


class ModuleResponse(ModuleBase):
    """API yanıtlarında modül bilgilerini döndürmek için şema.

    Attributes:
        id: Modülün benzersiz UUID'si.
        is_active: Modülün aktif olup olmadığı.
        created_at: Modülün oluşturulma zamanı.
    """

    id: uuid.UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ModuleDetailResponse(ModuleResponse):
    """Modül detay yanıtı; dersler dahil.

    Attributes:
        lessons: Modüle ait ders listesi.
    """

    lessons: list[LessonResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ModuleProgressResponse(BaseModel):
    """Kullanıcının bir modüldeki ilerleme bilgisini döndüren şema.

    Attributes:
        module: Modül bilgisi.
        completion_rate: 0.0–1.0 arasında tamamlama oranı.
        completed_lessons: Tamamlanan ders sayısı.
        total_lessons: Modüldeki toplam ders sayısı.
    """

    module: ModuleResponse
    completion_rate: float
    completed_lessons: int
    total_lessons: int

    model_config = ConfigDict(from_attributes=True)
