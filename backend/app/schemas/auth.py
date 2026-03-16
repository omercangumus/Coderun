# Coderun backend — kimlik doğrulama Pydantic şemaları.
# Giriş isteği, token yanıtı ve token verisi için kullanılır.

import uuid

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Kullanıcı giriş isteği için şema.

    Attributes:
        email: Kullanıcının e-posta adresi.
        password: Düz metin parola.
    """

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Başarılı kimlik doğrulama sonrası döndürülen token şeması.

    Attributes:
        access_token: Kısa ömürlü erişim token'ı.
        refresh_token: Uzun ömürlü yenileme token'ı.
        token_type: Token türü; varsayılan olarak "bearer".
    """

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """JWT token içinden çözümlenen veri için şema.

    Attributes:
        user_id: Token'a ait kullanıcının UUID'si.
        email: Token'a ait kullanıcının e-posta adresi.
    """

    user_id: uuid.UUID | None = None
    email: str | None = None
