# Coderun backend — tüm ORM modelleri için ortak abstract base model tanımı.

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from backend.app.core.database import Base


class BaseModel(Base):
    """Tüm ORM modellerinin türetileceği soyut temel sınıf.

    Her modele otomatik olarak şu alanları ekler:
    - ``id``: UUID birincil anahtar (varsayılan: uuid4)
    - ``created_at``: Kaydın oluşturulma zamanı (UTC, sunucu varsayılanı)
    - ``updated_at``: Kaydın son güncellenme zamanı (UTC, otomatik güncellenir)
    """

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        index=True,
    )
