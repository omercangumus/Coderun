# Coderun

Python, DevOps ve Cloud konularını Duolingo benzeri gamification mekanikleriyle öğreten eğitim platformu.

## Kurulum

### Gereksinimler

- Docker & Docker Compose
- Python 3.11+
- Flutter 3.x

### Yerel Geliştirme Ortamı

1. Repoyu klonla:

```bash
git clone https://github.com/omercangumus/Coderun.git
cd coderun
```

2. `.env` dosyasını oluştur:

```bash
cp .env.example .env
```

3. Servisleri ayağa kaldır:

```bash
docker-compose up -d
```

4. Migration'ları çalıştır:

```bash
docker-compose exec backend alembic upgrade head
```

5. API'yi test et:

```text
http://localhost:8000/docs
```

## API Endpoint'leri

### Auth

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/v1/auth/register | Kayıt ol |
| POST | /api/v1/auth/login | Giriş yap |
| POST | /api/v1/auth/refresh | Token yenile |
| GET | /api/v1/auth/me | Profil bilgisi |
| POST | /api/v1/auth/logout | Çıkış yap |

## Proje Yapısı

```
coderun/
├── .github/         # CI/CD workflow'ları
├── backend/        # FastAPI + PostgreSQL + Redis
│   ├── alembic/    # Migration dosyaları
│   ├── app/        # API, models, services, repositories
│   └── tests/      # Backend testleri
├── mobile/         # Flutter + Riverpod
├── web/            # Next.js 14 + TypeScript + Tailwind CSS
├── infrastructure/ # Terraform (AWS) + Ollama
├── docker-compose.yml
└── .env.example
```

## Branch Stratejisi

- main: production
- develop: aktif geliştirme
- feature/xxx: yeni özellikler

## Teknolojiler

- **Backend**: FastAPI, SQLAlchemy 2.x async, Pydantic v2, asyncpg
- **Mobile**: Flutter, Riverpod
- **Web**: Next.js 14, TypeScript, Tailwind CSS
- **Veritabanı**: PostgreSQL 15, Redis 7
- **AI**: Ollama + Llama 3.1
- **Altyapı**: Docker Compose, Terraform (AWS)
