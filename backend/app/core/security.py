# Coderun backend güvenlik yardımcıları — parola hashleme ve JWT token işlemleri.

# stdlib
from datetime import datetime, timedelta, timezone

# third party
from argon2 import PasswordHasher  # type: ignore[import-not-found]
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError  # type: ignore[import-not-found]
from jose import JWTError, jwt  # type: ignore[import-untyped]

# local
from app.core.config import settings

# ---------------------------------------------------------------------------
# Argon2 PasswordHasher — modern, güvenli parola hashleme
# ---------------------------------------------------------------------------

_ph = PasswordHasher(
    time_cost=2,       # iterasyon sayısı
    memory_cost=65536, # 64 MB
    parallelism=2,
    hash_len=32,
    salt_len=16,
)


# ---------------------------------------------------------------------------
# Parola işlemleri
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    """Verilen düz metin parolayı Argon2 ile güvenli biçimde hashler.

    Args:
        password: Hashlenmemiş düz metin parola.

    Returns:
        Argon2 hash dizesi.

    Note:
        Düz metin parola hiçbir zaman loglanmaz.
    """
    return _ph.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Düz metin parolayı Argon2 hash ile doğrular.

    Args:
        plain: Kullanıcının girdiği düz metin parola.
        hashed: Veritabanında saklanan parola hash'i.

    Returns:
        Parola eşleşiyorsa True, aksi hâlde False.

    Note:
        Düz metin parola hiçbir zaman loglanmaz.
    """
    try:
        return _ph.verify(hashed, plain)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


# ---------------------------------------------------------------------------
# JWT token işlemleri
# ---------------------------------------------------------------------------


def create_access_token(
    data: dict[str, object],
    expires_delta: timedelta | None = None,
) -> str:
    """JWT access token oluşturur.

    Args:
        data: Token payload'ına eklenecek anahtar-değer çiftleri.
        expires_delta: Özel süre sonu; verilmezse settings.ACCESS_TOKEN_EXPIRE_MINUTES kullanılır.

    Returns:
        İmzalanmış JWT access token dizesi.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict[str, object]) -> str:
    """JWT refresh token oluşturur.

    Süre sonu settings.REFRESH_TOKEN_EXPIRE_DAYS değerinden hesaplanır.

    Args:
        data: Token payload'ına eklenecek anahtar-değer çiftleri.

    Returns:
        İmzalanmış JWT refresh token dizesi.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict[str, object] | None:
    """JWT token'ı decode eder ve payload'ı döndürür.

    Geçersiz imza, süresi dolmuş token veya herhangi bir JWT hatası
    durumunda None döndürür; istisna fırlatmaz.

    Args:
        token: Decode edilecek JWT token dizesi.

    Returns:
        Başarılı decode'da payload dict'i, hata durumunda None.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
