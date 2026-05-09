# Coderun backend — ünite ORM modeli.
# Bir modül (learning path) içindeki tematik ders gruplarını temsil eder.

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.lesson import Lesson
    from app.models.module import Module


class Unit(BaseModel):
    """Bir modüle ait üniteyi (ders grubunu) temsil eden ORM modeli.

    Learning Path (Module) altındaki tematik gruplamadır.
    Örnek: Python modülünün "Temel Yapılar" ünitesi.

    Attributes:
        module_id: Ünitenin bağlı olduğu modülün UUID'si.
        title: Ünitenin görünen başlığı.
        description: Ünitenin kısa açıklaması.
        order: Modül içindeki sıralama indeksi.
        is_active: Ünitenin aktif olup olmadığı.
        module: Ünitenin ait olduğu modül (back_populates).
        lessons: Üniteye ait dersler (lazy loaded).
    """

    __tablename__ = "units"

    module_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("modules.id"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, default="", nullable=False)
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    module: Mapped[Module] = relationship("Module", back_populates="units")
    lessons: Mapped[list[Lesson]] = relationship(
        "Lesson",
        back_populates="unit",
        order_by="Lesson.order",
        lazy="select",
    )
