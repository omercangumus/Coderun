# Implementation Plan: Coderun Monorepo Altyapısı

## Overview

Bu plan, Coderun monorepo altyapısını sıfırdan kurmak için gereken kodlama adımlarını tanımlar. Her görev bir öncekinin üzerine inşa edilir ve sonunda tüm bileşenler birbirine bağlanır.

## Tasks

- [x] 1. Monorepo kök klasör yapısını ve iskelet dosyalarını oluştur
  - `.github/workflows/` altında `backend-ci.yml`, `mobile-ci.yml`, `web-ci.yml` iskelet dosyalarını oluştur
  - `mobile/`, `web/` dizinleri için `.gitkeep` dosyaları ekle
  - `infrastructure/terraform/modules/` ve `infrastructure/ollama/` dizinlerini oluştur
  - `README.md` dosyasını oluştur
  - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.1 `.gitignore` dosyasını oluştur
    - Python, Flutter, Node.js, Terraform ve Docker için standart ignore kurallarını ekle
    - `hypothesis/` dizinini de ignore et
    - _Requirements: 1.4_

  - [x] 1.2 `.env.example` dosyasını oluştur
    - `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `ENVIRONMENT`, `ALLOWED_ORIGINS` değişkenlerini açıklayıcı yorumlarla listele
    - Gerçek değer içermemeli, sadece örnek format göster
    - _Requirements: 1.5, 5.1, 5.2_

- [x] 2. Backend Python paket yapısını oluştur
  - `backend/app/` altında tüm katman dizinlerini (`core/`, `models/`, `schemas/`, `repositories/`, `services/`, `api/v1/endpoints/`) oluştur
  - Her dizine `__init__.py` ekle
  - `backend/tests/` dizinini oluştur, `__init__.py` ekle
  - `backend/alembic/` dizinini oluştur
  - _Requirements: 2.1, 2.2_

- [x] 3. Core dosyaları implement et
  - [x] 3.1 `backend/app/core/config.py` dosyasını oluştur
    - `pydantic-settings` tabanlı `Settings` sınıfını yaz
    - `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `ENVIRONMENT`, `ALLOWED_ORIGINS`, `APP_TITLE`, `APP_VERSION` alanlarını tanımla
    - `is_production` property'sini ekle
    - Magic number kullanma; tüm değerler ortam değişkenlerinden gelsin
    - _Requirements: 5.1, 5.2, 5.8, 9.1_

  - [x] 3.2 `backend/app/core/database.py` dosyasını oluştur
    - `asyncpg` sürücüsü ile async SQLAlchemy engine ve `AsyncSessionLocal` factory oluştur
    - `get_db()` async generator fonksiyonunu FastAPI dependency olarak yaz
    - Exception durumunda `rollback()` çağır
    - _Requirements: 5.3, 5.4, 4.6_

  - [x] 3.3 `backend/app/core/security.py` dosyasını oluştur
    - `create_access_token(data: dict, expires_delta: timedelta | None) -> str` fonksiyonunu yaz
    - `verify_token(token: str) -> TokenData | None` fonksiyonunu yaz
    - `hash_password(password: str) -> str` ve `verify_password(plain: str, hashed: str) -> bool` fonksiyonlarını bcrypt ile yaz
    - Hiçbir fonksiyonda düz metin parola loglanmamalı
    - _Requirements: 5.5, 5.6, 5.7_

  - [ ]* 3.4 `backend/tests/test_security.py` için property testleri yaz
    - **Property 2: Parola Hashleme Round-Trip**
    - **Validates: Requirements 5.6**
    - **Property 3: Parola Loglama Yasağı**
    - **Validates: Requirements 5.7**

- [x] 4. Veritabanı modellerini implement et
  - [x] 4.1 `backend/app/models/base.py` dosyasını oluştur
    - `DeclarativeBase`'den türeyen `Base` sınıfını yaz
    - `__abstract__ = True` ile `BaseModel` sınıfını tanımla: UUID PK, `created_at`, `updated_at` alanları, `index=True`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 4.2 Entity modellerini oluştur
    - `backend/app/models/user.py`: `User` modeli — `email`, `hashed_password`, `username`, `is_active`, `is_verified`
    - `backend/app/models/module.py`: `Module` modeli — `title`, `description`, `order`, `is_published`
    - `backend/app/models/lesson.py`: `Lesson` modeli — `module_id` FK, `title`, `content`, `order`, `xp_reward`
    - `backend/app/models/question.py`: `Question` modeli — `lesson_id` FK, `question_text`, `question_type`, `options` JSON, `correct_answer`
    - `backend/app/models/user_progress.py`: `UserProgress` modeli — `user_id` FK, `lesson_id` FK, `completed_at`, `score`, `attempts`
    - `backend/app/models/user_badge.py`: `UserBadge` modeli — `user_id` FK, `badge_name`, `awarded_at`
    - Her model `BaseModel`'den türemeli; `password` alanı içermemeli
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11_

  - [ ]* 4.3 `backend/tests/test_models.py` için unit testleri yaz
    - Her modelin beklenen alanları içerdiğini doğrula
    - Her modelin `BaseModel`'den türediğini doğrula
    - `User` modelinde `password` alanı olmadığını doğrula
    - _Requirements: 3.4, 3.5_

- [x] 5. Pydantic şemalarını implement et
  - [x] 5.1 `backend/app/schemas/user.py` dosyasını oluştur
    - `UserCreate`, `UserUpdate`, `UserResponse` sınıflarını yaz
    - `UserResponse`'da `hashed_password` alanı bulunmamalı
    - UUID alanları `uuid.UUID` tipinde olmalı
    - `model_config = ConfigDict(from_attributes=True)` ekle
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 5.2 `backend/app/schemas/auth.py` dosyasını oluştur
    - `LoginRequest`, `TokenResponse`, `TokenData` sınıflarını yaz
    - _Requirements: 6.2_

  - [x] 5.3 `backend/app/schemas/common.py` dosyasını oluştur
    - Generic `PaginatedResponse[T]` şemasını yaz: `items: list[T]`, `total: int`, `skip: int`, `limit: int`
    - _Requirements: 6.3_

  - [ ]* 5.4 `backend/tests/test_schemas.py` için property testleri yaz
    - **Property 7: UUID Tip Tutarlılığı**
    - **Validates: Requirements 6.4, 3.1**

- [x] 6. Repository katmanını implement et
  - [x] 6.1 `backend/app/repositories/base_repository.py` dosyasını oluştur
    - `Generic[T]` ve `ABC`'den türeyen `BaseRepository` sınıfını yaz
    - `get_by_id`, `get_all`, `create`, `update`, `delete` async metotlarını implement et
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 6.2 `backend/app/repositories/user_repository.py` dosyasını oluştur
    - `BaseRepository[User]`'dan türeyen `UserRepository` sınıfını yaz
    - `get_by_email(email: str) -> User | None` metodunu ekle
    - _Requirements: 4.3_

  - [x] 6.3 `backend/app/repositories/progress_repository.py` dosyasını oluştur
    - `BaseRepository[UserProgress]`'dan türeyen `ProgressRepository` sınıfını yaz
    - `get_by_user_and_lesson(user_id: UUID, lesson_id: UUID) -> UserProgress | None` metodunu ekle
    - _Requirements: 4.4_

  - [ ]* 6.4 `backend/tests/test_repositories.py` için property testleri yaz
    - **Property 4: Repository Hata Durumunda Rollback**
    - **Validates: Requirements 4.6**

- [x] 7. Checkpoint — Tüm testlerin geçtiğini doğrula
  - Tüm testlerin geçtiğini doğrula, sorular varsa kullanıcıya sor.

- [x] 8. FastAPI `main.py` ve health endpoint'ini implement et
  - [x] 8.1 `backend/app/api/v1/endpoints/health.py` dosyasını oluştur
    - `GET /health` endpoint'ini yaz; `{"status": "ok", "environment": "<env>"}` döndürsün
    - _Requirements: 9.3_

  - [x] 8.2 `backend/app/main.py` dosyasını oluştur
    - `FastAPI` örneği oluştur; `Config`'den `title` ve `version` oku
    - `CORSMiddleware`'i `ALLOWED_ORIGINS` ile yapılandır
    - Production'da OpenAPI endpoint'lerini devre dışı bırak
    - Health router ve `api_router`'ı `/api/v1` prefix'i ile dahil et
    - Startup event'inde `SELECT 1` ile DB bağlantısını doğrula; başarısız olursa `SystemExit(1)` fırlat
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 8.3 `backend/tests/test_health.py` için unit testleri yaz
    - `/health` endpoint'inin doğru format döndürdüğünü doğrula
    - Production modunda OpenAPI endpoint'lerinin devre dışı olduğunu doğrula
    - _Requirements: 9.3, 9.4_

- [x] 9. Backend Dockerfile ve `requirements.txt` dosyalarını oluştur
  - [x] 9.1 `backend/requirements.txt` dosyasını oluştur
    - `fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncio]`, `asyncpg`, `alembic`, `pydantic[email]`, `pydantic-settings`, `python-jose[cryptography]`, `passlib[bcrypt]`, `redis`, `httpx` bağımlılıklarını `==` ile sabitlenmiş sürümlerle listele
    - Test bağımlılıklarını da ekle: `pytest`, `pytest-asyncio`, `hypothesis`, `pytest-mock`, `factory-boy`
    - _Requirements: 8.4_

  - [x] 9.2 `backend/Dockerfile` dosyasını oluştur
    - `python:3.11-slim` temel imajını kullan
    - Önce `requirements.txt` kopyala ve kur (layer cache optimizasyonu), sonra uygulama kodunu kopyala
    - `appuser` adında root olmayan kullanıcı oluştur ve uygulamayı bu kullanıcıyla çalıştır
    - `HEALTHCHECK` direktifi ekle
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [ ]* 9.3 `backend/tests/test_requirements.py` için property testleri yaz
    - **Property 6: Bağımlılık Sürüm Sabitleme**
    - **Validates: Requirements 8.4**

- [x] 10. Docker Compose yapılandırmasını oluştur
  - [x] 10.1 `docker-compose.yml` dosyasını oluştur
    - `backend`, `web`, `db` (`postgres:15-alpine`), `redis` (`redis:7-alpine`), `ollama` servislerini tanımla
    - `backend` servisine `depends_on: [db, redis]` ekle
    - Tüm hassas değerleri `${VARIABLE}` sözdizimi ile `.env`'den oku
    - `db` için named volume tanımla
    - `backend` için kaynak kodu bind mount ekle
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 10.2 `backend/tests/test_docker_compose.py` için property ve unit testleri yaz
    - **Property 5: Docker Compose Hassas Değer Yasağı**
    - **Validates: Requirements 7.5**
    - Servis tanımlarını, imaj versiyonlarını ve volume yapılandırmasını doğrula
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

- [x] 11. Test altyapısını ve property testlerini tamamla
  - [x] 11.1 `backend/tests/conftest.py` dosyasını oluştur
    - Paylaşılan fixture'ları tanımla: async session mock, test client
    - `pytest-asyncio` için `asyncio_mode = "auto"` yapılandırmasını ekle
    - _Requirements: 2.1_

  - [x] 11.2 `backend/tests/test_code_quality.py` dosyasını oluştur
    - **Property 1: Kod Kalitesi Kuralları Evrensel Uyumu**
    - **Validates: Requirements 2.5, 2.6, 2.7**
    - `backend/app/` altındaki tüm Python dosyalarını tara; her dosyanın başında yorum, type hint ve docstring varlığını doğrula

  - [x] 11.3 `backend/tests/test_config.py` dosyasını oluştur
    - `is_production` property'sinin doğru çalıştığını doğrula
    - Ortam değişkeni okuma davranışını test et
    - _Requirements: 5.1, 5.8_

- [x] 12. Final checkpoint — Tüm testlerin geçtiğini doğrula
  - Tüm testlerin geçtiğini doğrula, sorular varsa kullanıcıya sor.

## Notes

- `*` ile işaretli görevler opsiyoneldir; MVP için atlanabilir
- Her görev ilgili requirements'a referans verir
- Property testleri `hypothesis` ile minimum 100 iterasyon çalıştırılır
- Her property testi şu yorum formatını içermelidir: `# Feature: coderun-monorepo-setup, Property {N}: {property_text}`
- Testler: `pytest backend/tests/ --asyncio-mode=auto -v`
