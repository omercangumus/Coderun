# Coderun backend — öğrenme modülü ORM modeli.
# Python, DevOps, Cloud gibi üst düzey konu gruplarını temsil eder.

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.models.base import BaseModel


class Module(BaseModel):
    """Bir öğrenme modülünü (konu grubunu) temsil eden ORM modeli.

    Attributes:
        title: Modülün görünen başlığı.
        slug: URL dostu benzersiz tanımlayıcı (örn. "python", "devops").
        description: Modülün kısa açıklaması.
        order: Modüllerin sıralanma indeksi.
        is_active: Modülün aktif olup olmadığı.
        is_published: Modülün yayınlanıp yayınlanmadığı.
    """

    __tablename__ = "modules"

    title: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )
    order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
