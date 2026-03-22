# Requirements Document

## Introduction

Coderun, Python/DevOps/Cloud konularını Duolingo benzeri gamification mekanikleriyle öğreten bir mobil (Flutter) ve web (Next.js) platformudur. Bu spec, Coderun projesinin monorepo altyapısını sıfırdan kurmayı kapsar: klasör yapısı, backend mimarisi (FastAPI + PostgreSQL + Redis), veritabanı modelleri, repository katmanı, core servisler, Pydantic şemalar, Docker Compose ortamı ve CI/CD iskelet yapısı.

## Glossary

- **Monorepo**: Birden fazla alt projeyi (backend, mobile, web, infrastructure) tek bir Git deposunda barındıran yapı.
- **Backend**: FastAPI tabanlı REST API servisi.
- **Mobile**: Flutter + Riverpod tabanlı mobil uygulama.
- **Web**: Next.js 14 + TypeScript + Tailwind CSS tabanlı web uygulaması.
- **Infrastructure**: Terraform ile yönetilen AWS altyapı kodları.
- **BaseRepository**: Generic abstract repository sınıfı; tüm entity repository'lerinin türediği temel sınıf.
- **BaseModel**: UUID birincil anahtar, oluşturma/güncelleme zaman damgaları ve indeksleri içeren temel SQLAlchemy modeli.
- **Config**: Pydantic BaseSettings tabanlı uygulama konfigürasyon sınıfı.
- **AI_Mentor**: Ollama + Llama 3.1 tabanlı yapay zeka öğretmen servisi.
- **Docker_Compose**: Tüm servisleri (backend, web, db, redis, ollama) orkestre eden Docker Compose yapılandırması.
- **JWT**: JSON Web Token; kimlik doğrulama için kullanılan token formatı.

---

## Requirements

### Requirement 1: Monorepo Klasör Yapısı

**User Story:** Bir geliştirici olarak, tüm alt projelerin tek bir depoda düzenli biçimde yer almasını istiyorum; böylece bağımlılık yönetimi ve CI/CD entegrasyonu kolaylaşsın.

#### Acceptance Criteria

1. THE Monorepo SHALL içermek: `.github/workflows/`, `backend/`, `mobile/`, `web/`, `infrastructure/`, `docker-compose.yml`, `.env.example`, `.gitignore`, `README.md` dizin ve dosyalarını.
2. THE Monorepo SHALL her alt proje için ayrı bir kök dizin sağlamalıdır: `backend/`, `mobile/`, `web/`, `infrastructure/`.
3. THE Monorepo SHALL `.github/workflows/` dizininde en az bir CI workflow iskelet dosyası içermelidir.
4. THE `.gitignore` SHALL Python, Flutter, Node.js, Terraform ve Docker için standart ignore kurallarını kapsamalıdır.
5. THE `.env.example` SHALL tüm zorunlu ortam değişkenlerini açıklayıcı yorumlarla listelemelidir; gerçek değer içermemelidir.

---

### Requirement 2: SOLID Uyumlu Backend Mimarisi

**User Story:** Bir backend geliştirici olarak, SOLID prensiplerine uygun katmanlı bir mimari istiyorum; böylece kod bakımı ve test edilebilirliği artsın.

#### Acceptance Criteria

1. THE Backend SHALL şu katman dizinlerini içermelidir: `models/`, `schemas/`, `repositories/`, `services/`, `endpoints/` (veya `routers/`).
2. THE Backend SHALL her katmanı ayrı bir Python paketi (`__init__.py` içeren) olarak organize etmelidir.
3. THE Backend SHALL bağımlılıkları constructor injection veya FastAPI `Depends()` mekanizmasıyla enjekte etmelidir; global state kullanmamalıdır.
4. WHEN bir endpoint çağrıldığında, THE Backend SHALL iş mantığını doğrudan endpoint fonksiyonunda değil, ilgili service katmanında yürütmelidir.
5. THE Backend SHALL her Python dosyasının başında o dosyanın amacını açıklayan bir yorum satırı içermelidir.
6. THE Backend SHALL tüm fonksiyon ve metotlarda type hint kullanmalıdır.
7. THE Backend SHALL tüm public fonksiyon ve metotlarda docstring içermelidir.

---

### Requirement 3: Veritabanı Modelleri

**User Story:** Bir backend geliştirici olarak, kullanıcı, modül, ders, soru, ilerleme ve rozet verilerini temsil eden SQLAlchemy modellerine ihtiyacım var; böylece uygulama verisi tutarlı biçimde saklanabilsin.

#### Acceptance Criteria

1. THE BaseModel SHALL UUID tipinde (Python `uuid.UUID`, string değil) birincil anahtar sağlamalıdır.
2. THE BaseModel SHALL `created_at` ve `updated_at` alanlarını `datetime` tipinde, otomatik doldurulacak şekilde içermelidir.
3. THE BaseModel SHALL sık sorgulanan alanlara (`created_at`, `updated_at`) veritabanı indeksi tanımlamalıdır.
4. THE Backend SHALL şu modelleri içermelidir: `User`, `Module`, `Lesson`, `Question`, `UserProgress`, `UserBadge`; her biri `BaseModel`'den türemelidir.
5. THE `User` modeli SHALL `email`, `hashed_password`, `username`, `is_active`, `is_verified` alanlarını içermelidir; `password` alanı içermemelidir.
6. THE `Module` modeli SHALL `title`, `description`, `order`, `is_published` alanlarını içermelidir.
7. THE `Lesson` modeli SHALL `module_id` (foreign key), `title`, `content`, `order`, `xp_reward` alanlarını içermelidir.
8. THE `Question` modeli SHALL `lesson_id` (foreign key), `question_text`, `question_type`, `options` (JSON), `correct_answer` alanlarını içermelidir.
9. THE `UserProgress` modeli SHALL `user_id` (foreign key), `lesson_id` (foreign key), `completed_at`, `score`, `attempts` alanlarını içermelidir.
10. THE `UserBadge` modeli SHALL `user_id` (foreign key), `badge_name`, `awarded_at` alanlarını içermelidir.
11. IF bir model alanı hassas veri (örn. `hashed_password`) içeriyorsa, THEN THE Backend SHALL bu alanı loglama veya serialization dışında tutmalıdır.

---

### Requirement 4: Generic Repository Katmanı

**User Story:** Bir backend geliştirici olarak, tekrar eden CRUD kodunu ortadan kaldıran generic bir repository soyutlamasına ihtiyacım var; böylece her entity için ayrı ayrı temel operasyonlar yazmak zorunda kalmayayım.

#### Acceptance Criteria

1. THE `BaseRepository[T]` SHALL generic abstract bir sınıf olmalıdır; tip parametresi `T` bir SQLAlchemy model sınıfını temsil etmelidir.
2. THE `BaseRepository[T]` SHALL şu async metotları sağlamalıdır: `get_by_id(id: UUID) -> T | None`, `get_all(skip: int, limit: int) -> list[T]`, `create(obj_in: dict) -> T`, `update(id: UUID, obj_in: dict) -> T | None`, `delete(id: UUID) -> bool`.
3. THE `UserRepository` SHALL `BaseRepository[User]`'dan türemeli ve `get_by_email(email: str) -> User | None` metodunu ek olarak sağlamalıdır.
4. THE `ProgressRepository` SHALL `BaseRepository[UserProgress]`'dan türemeli ve `get_by_user_and_lesson(user_id: UUID, lesson_id: UUID) -> UserProgress | None` metodunu ek olarak sağlamalıdır.
5. THE Repository katmanı SHALL tüm veritabanı işlemlerini `async/await` ile gerçekleştirmelidir.
6. IF bir veritabanı işlemi başarısız olursa, THEN THE Repository SHALL uygun bir exception fırlatmalı ve transaction'ı geri almalıdır.

---

### Requirement 5: Core Dosyalar

**User Story:** Bir backend geliştirici olarak, konfigürasyon, veritabanı bağlantısı ve güvenlik işlemlerini merkezi core modüllerde yönetmek istiyorum; böylece bu sorumluluklar uygulama genelinde tutarlı biçimde kullanılabilsin.

#### Acceptance Criteria

1. THE `Config` SHALL Pydantic `BaseSettings` tabanlı olmalı ve tüm konfigürasyon değerlerini ortam değişkenlerinden okumalıdır; magic number içermemelidir.
2. THE `Config` SHALL şu değişkenleri içermelidir: `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `ALGORITHM` (JWT), `ACCESS_TOKEN_EXPIRE_MINUTES`, `ENVIRONMENT`, `ALLOWED_ORIGINS`.
3. THE `database.py` SHALL async SQLAlchemy engine ve session factory oluşturmalıdır; `asyncpg` sürücüsünü kullanmalıdır.
4. THE `database.py` SHALL FastAPI dependency injection ile kullanılabilecek `get_db()` async generator fonksiyonunu sağlamalıdır.
5. THE `security.py` SHALL JWT token oluşturma (`create_access_token`) ve doğrulama (`verify_token`) fonksiyonlarını içermelidir.
6. THE `security.py` SHALL parola hashleme için `bcrypt` algoritmasını kullanmalıdır: `hash_password(password: str) -> str` ve `verify_password(plain: str, hashed: str) -> bool`.
7. IF `security.py` içindeki herhangi bir fonksiyon çağrıldığında, THEN THE Backend SHALL düz metin parolayı hiçbir log kaydına yazmamamalıdır.
8. THE `Config` SHALL `ENVIRONMENT` değeri `"production"` olduğunda OpenAPI dokümantasyonunu devre dışı bırakacak bir bayrak sağlamalıdır.

---

### Requirement 6: Pydantic Şemalar

**User Story:** Bir backend geliştirici olarak, API giriş/çıkış verilerini doğrulayan ve belgeleyen Pydantic şemalarına ihtiyacım var; böylece veri tutarlılığı ve API dokümantasyonu otomatik olarak sağlansın.

#### Acceptance Criteria

1. THE `user.py` şeması SHALL `UserCreate`, `UserUpdate`, `UserResponse` sınıflarını içermelidir; `UserResponse` `hashed_password` alanını dışarıya açmamalıdır.
2. THE `auth.py` şeması SHALL `LoginRequest`, `TokenResponse`, `TokenData` sınıflarını içermelidir.
3. THE `common.py` SHALL generic `PaginatedResponse[T]` şemasını içermelidir: `items: list[T]`, `total: int`, `skip: int`, `limit: int` alanlarıyla.
4. THE Şemalar SHALL UUID alanlarını `uuid.UUID` tipinde tanımlamalıdır; string olarak değil.
5. THE Şemalar SHALL `model_config = ConfigDict(from_attributes=True)` ile ORM modelleriyle uyumlu olmalıdır.
6. WHEN geçersiz veri gönderildiğinde, THE Backend SHALL Pydantic doğrulama hatalarını HTTP 422 yanıtı olarak döndürmelidir.

---

### Requirement 7: Docker Compose Ortamı

**User Story:** Bir geliştirici olarak, tüm servisleri tek komutla ayağa kaldırabileceğim bir Docker Compose yapılandırması istiyorum; böylece yerel geliştirme ortamı hızlıca kurulabilsin.

#### Acceptance Criteria

1. THE `docker-compose.yml` SHALL şu servisleri tanımlamalıdır: `backend`, `web`, `db`, `redis`, `ollama`.
2. THE `db` servisi SHALL `postgres:15-alpine` imajını kullanmalıdır.
3. THE `redis` servisi SHALL `redis:7-alpine` imajını kullanmalıdır.
4. THE `backend` servisi SHALL `db` ve `redis` servislerine `depends_on` ile bağımlılık tanımlamalıdır.
5. THE `docker-compose.yml` SHALL tüm hassas değerleri `.env` dosyasından `${VARIABLE}` sözdizimi ile okumalıdır; sabit kodlanmış değer içermemelidir.
6. THE `db` servisi SHALL veri kalıcılığı için named volume kullanmalıdır.
7. THE `backend` servisi SHALL geliştirme modunda kaynak kodu bind mount ile container'a bağlamalıdır.
8. WHEN `docker compose up` komutu çalıştırıldığında, THE Docker_Compose SHALL backend servisinin `http://localhost:8000/health` adresinde yanıt vermesini sağlamalıdır.

---

### Requirement 8: Backend Dockerfile ve Bağımlılıklar

**User Story:** Bir DevOps mühendisi olarak, güvenli ve hafif bir backend container imajına ihtiyacım var; böylece üretim ortamına güvenle deploy edilebilsin.

#### Acceptance Criteria

1. THE Backend `Dockerfile` SHALL `python:3.11-slim` temel imajını kullanmalıdır.
2. THE Backend `Dockerfile` SHALL uygulamayı root olmayan bir kullanıcı (`appuser`) ile çalıştırmalıdır.
3. THE Backend `Dockerfile` SHALL bağımlılıkları önce kopyalayıp kurmalı (layer cache optimizasyonu), ardından uygulama kodunu kopyalamalıdır.
4. THE `requirements.txt` SHALL tüm Python bağımlılıklarını sabitlenmiş sürümlerle (`==`) listelemelidir: `fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncio]`, `asyncpg`, `alembic`, `pydantic[email]`, `pydantic-settings`, `python-jose[cryptography]`, `passlib[bcrypt]`, `redis`, `httpx`.
5. THE Backend `Dockerfile` SHALL `HEALTHCHECK` direktifi içermelidir.

---

### Requirement 9: FastAPI Ana Uygulama

**User Story:** Bir backend geliştirici olarak, CORS, sağlık kontrolü ve ortama göre OpenAPI yapılandırması içeren bir FastAPI uygulama giriş noktasına ihtiyacım var; böylece API güvenli ve izlenebilir biçimde çalışsın.

#### Acceptance Criteria

1. THE `main.py` SHALL bir FastAPI uygulama örneği oluşturmalı ve `Config`'den uygulama meta verilerini (title, version) okumalıdır.
2. THE `main.py` SHALL `CORSMiddleware`'i `Config.ALLOWED_ORIGINS` değerini kullanarak yapılandırmalıdır.
3. THE Backend SHALL `GET /health` endpoint'ini sağlamalı; bu endpoint `{"status": "ok", "environment": "<env>"}` formatında yanıt döndürmelidir.
4. WHEN `Config.ENVIRONMENT` değeri `"production"` ise, THEN THE Backend SHALL OpenAPI (`/docs`, `/redoc`, `/openapi.json`) endpoint'lerini devre dışı bırakmalıdır.
5. THE `main.py` SHALL tüm router'ları `/api/v1` prefix'i ile dahil etmelidir.
6. THE Backend SHALL uygulama başlangıcında veritabanı bağlantısını doğrulamalı; bağlantı başarısız olursa başlatmayı durdurmalıdır.
