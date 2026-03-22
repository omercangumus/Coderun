# Coderun backend — kullanıcı Pydantic şemaları.
# Kullanıcı oluşturma, güncelleme ve API yanıtları için kullanılır.

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    """Kullanıcı şemalarının ortak alanlarını tanımlar."""

    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Yeni kullanıcı oluşturma isteği için şema.

    Attributes:
        password: Düz metin parola; yalnızca giriş sırasında kullanılır, saklanmaz.
    """

    password: str


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
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserInDB(UserBase):
    """Veritabanından okunan kullanıcı verisi için dahili şema.

    Attributes:
        hashed_password: Bcrypt ile hashlenmiş parola.
    """

    hashed_password: str

    model_config = ConfigDict(from_attributes=True)
