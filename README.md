# Coderun

Python, DevOps ve Cloud konularını Duolingo benzeri gamification mekanikleriyle öğreten eğitim platformu.

## Proje Yapısı

```
coderun/
├── backend/        # FastAPI + PostgreSQL + Redis
├── mobile/         # Flutter + Riverpod
├── web/            # Next.js 14 + TypeScript + Tailwind CSS
├── infrastructure/ # Terraform (AWS) + Ollama
└── .github/        # CI/CD workflow'ları
```

## Hızlı Başlangıç

```bash
# Ortam değişkenlerini ayarla
cp .env.example .env

# Tüm servisleri başlat
docker compose up -d
```

## Servisler

| Servis   | URL                        |
|----------|----------------------------|
| Backend  | http://localhost:8000      |
| API Docs | http://localhost:8000/docs |
| Web      | http://localhost:3000      |
| Ollama   | http://localhost:11434     |

## Teknolojiler

- **Backend**: FastAPI, SQLAlchemy 2.x async, Pydantic v2, asyncpg
- **Mobile**: Flutter, Riverpod
- **Web**: Next.js 14, TypeScript, Tailwind CSS
- **Veritabanı**: PostgreSQL 15, Redis 7
- **AI**: Ollama + Llama 3.1
- **Altyapı**: Docker Compose, Terraform (AWS)

---

## Geliştirme Takvimi

### Hafta 1 — Proje Kurulumu ve Altyapı

- [x] Monorepo klasör yapısının oluşturulması
- [x] GitHub repository ve branch stratejisi
- [x] Docker Compose ile PostgreSQL ve Redis'in ayağa kaldırılması
- [x] .env yapısı ve ortam değişkenlerinin tanımlanması
