# Coderun backend — kullanıcı ORM modeli.
# Kimlik doğrulama, XP/seviye sistemi ve streak takibi için kullanılır.

from datetime import date

from sqlalchemy import Boolean, Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.models.base import BaseModel


class User(BaseModel):
    """Platforma kayıtlı kullanıcıyı temsil eden ORM modeli.

    Attributes:
        email: Kullanıcının benzersiz e-posta adresi.
        username: Kullanıcının benzersiz kullanıcı adı.
        hashed_password: Bcrypt ile hashlenmiş parola (düz metin saklanmaz).
        xp: Kullanıcının toplam deneyim puanı.
        level: Kullanıcının mevcut seviyesi.
        streak: Ardışık aktif gün sayısı.
        last_active_date: Son aktif olduğu tarih.
        is_active: Hesabın aktif olup olmadığı.
        is_verified: E-posta doğrulamasının tamamlanıp tamamlanmadığı.
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )
    username: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )
    hashed_password: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )
    xp: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    level: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )
    streak: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    last_active_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
