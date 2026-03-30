# Coderun backend uygulama yapılandırması — pydantic-settings tabanlı Settings sınıfı.

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Uygulama genelinde kullanılan yapılandırma ayarları.

    Tüm değerler ortam değişkenlerinden veya .env dosyasından okunur.
    Hassas alanlar (DATABASE_URL, REDIS_URL, SECRET_KEY) varsayılan değer
    içermez; ortamda tanımlanmaları zorunludur.
    """

    # --- Veritabanı & Cache ---
    DATABASE_URL: str
    REDIS_URL: str

    # --- Güvenlik ---
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    AUTH_INVALID_CREDENTIALS_MESSAGE: str = "Geçersiz kimlik bilgileri"

    # --- Harici Servisler ---
    OLLAMA_URL: str = "http://localhost:11434"

    # --- Uygulama ---
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    APP_TITLE: str = "Coderun"
    APP_VERSION: str = "0.1.0"

    # --- Seviye Testi (Placement) Eşikleri ---
    PLACEMENT_BEGINNER_MAX: float = 0.30
    PLACEMENT_INTERMEDIATE_MAX: float = 0.60
    PLACEMENT_ADVANCED_MAX: float = 0.80
    PLACEMENT_QUESTION_COUNT: int = 15
    LESSON_PASS_SCORE: int = 70

    # --- XP & Seviye Sistemi ---
    XP_PER_LEVEL: int = 100
    MAX_LEVEL: int = 50
    STREAK_BONUS_MULTIPLIER: float = 1.5
    STREAK_FREEZE_HOURS: int = 36

    # --- Rozet Eşikleri ---
    BADGE_FIRST_LESSON_XP: int = 0
    BADGE_STREAK_7_DAYS: int = 7
    BADGE_STREAK_30_DAYS: int = 30
    BADGE_MODULE_COMPLETE: int = 100
    BADGE_LEVEL_5: int = 5
    BADGE_LEVEL_10: int = 10

    # --- Redis Liderboard ---
    LEADERBOARD_TTL_SECONDS: int = 604800
    LEADERBOARD_TOP_N: int = 100

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def is_production(self) -> bool:
        """Uygulamanın production ortamında çalışıp çalışmadığını döndürür."""
        return self.ENVIRONMENT == "production"


settings = Settings()
