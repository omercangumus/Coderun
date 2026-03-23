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

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def is_production(self) -> bool:
        """Uygulamanın production ortamında çalışıp çalışmadığını döndürür."""
        return self.ENVIRONMENT == "production"


settings = Settings()
