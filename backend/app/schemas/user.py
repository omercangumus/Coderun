# Coderun backend — kullanıcı Pydantic şemaları.
# Kullanıcı oluşturma, güncelleme ve API yanıtları için kullanılır.

import uuid
from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UserBase(BaseModel):
    """Kullanıcı şemalarının ortak alanlarını tanımlar."""

    email: EmailStr
    username: str


class UserUpdate(BaseModel):
    """Kullanıcı bilgilerini güncelleme isteği için şema.

    Tüm alanlar opsiyoneldir; yalnızca gönderilen alanlar güncellenir.
    """

    email: EmailStr | None = None
    username: str | None = None


class UserResponse(UserBase):
    """API yanıtlarında kullanıcı bilgilerini döndürmek için şema.

    Attributes:
        id: Kullanıcının benzersiz UUID'si.
        xp: Toplam deneyim puanı.
        level: Mevcut seviye.
        streak: Ardışık aktif gün sayısı.
        is_active: Hesabın aktif olup olmadığı.
        created_at: Hesabın oluşturulma zamanı.

    Note:
        hashed_password bu şemaya hiçbir zaman eklenmez.
    """

    id: uuid.UUID
    xp: int
    level: int
    streak: int
    last_active_date: date | None = None
    is_active: bool
    is_verified: bool = False
    created_at: datetime

    @field_validator("last_active_date", mode="before")
    @classmethod
    def coerce_last_active_date(cls, v: Any) -> date | None:
        """last_active_date alanını güvenli şekilde date'e çevirir."""
        if v is None:
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            from datetime import date as dt_date
            try:
                return dt_date.fromisoformat(v)
            except ValueError:
                return None
        # MagicMock veya bilinmeyen tip → None
        return None

    model_config = ConfigDict(from_attributes=True)


class UserInDB(UserBase):
    """Veritabanından okunan kullanıcı verisi için dahili şema.

    Attributes:
        hashed_password: Bcrypt ile hashlenmiş parola.
    """

    hashed_password: str

    model_config = ConfigDict(from_attributes=True)
