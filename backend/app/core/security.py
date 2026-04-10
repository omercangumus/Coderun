# Coderun backend güvenlik yardımcıları — parola hashleme ve JWT token işlemleri.

# stdlib
from datetime import datetime, timedelta, timezone

# third party
from jose import JWTError, jwt
from passlib.context import CryptContext

# local
from backend.app.core.config import settings

# ---------------------------------------------------------------------------
# Passlib CryptContext — pbkdf2_sha256 şeması
# ---------------------------------------------------------------------------

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------------------------------------------------------------------
# Parola işlemleri
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    """Verilen düz metin parolayı güvenli biçimde hashler.

    Args:
        password: Hashlenmemiş düz metin parola.

    Returns:
        Hash dizesi.

    Note:
        Düz metin parola hiçbir zaman loglanmaz.
    """
    return _pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Düz metin parolayı hash ile doğrular.

    Args:
        plain: Kullanıcının girdiği düz metin parola.
        hashed: Veritabanında saklanan parola hash'i.

    Returns:
        Parola eşleşiyorsa True, aksi hâlde False.

    Note:
        Düz metin parola hiçbir zaman loglanmaz.
    """
    return _pwd_context.verify(plain, hashed)


# ---------------------------------------------------------------------------
# JWT token işlemleri
# ---------------------------------------------------------------------------


def create_access_token(
    data: dict,
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


def create_refresh_token(data: dict) -> str:
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


def decode_token(token: str) -> dict | None:
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
