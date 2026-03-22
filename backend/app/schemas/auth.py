# Coderun backend — auth, token ve kayıt akışında kullanılan Pydantic şemaları.

import re
import uuid

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    """Kullanıcı kayıt isteği şeması."""

    email: EmailStr
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        """Parola gücünü doğrular."""
        if not re.search(r"[A-Z]", value):
            raise ValueError("Şifre en az bir büyük harf içermelidir.")
        if not re.search(r"\d", value):
            raise ValueError("Şifre en az bir rakam içermelidir.")
        return value


class TokenResponse(BaseModel):
    """Token üretim yanıtı şeması."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Refresh token yenileme isteği şeması."""

    refresh_token: str


class TokenData(BaseModel):
    """JWT payload'dan çözümlenen kullanıcı verisi."""

    user_id: uuid.UUID | None = None
    email: str | None = None
