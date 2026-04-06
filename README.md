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

### Modüller

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | /api/v1/modules | Hayır | Tüm modülleri listele |
| GET | /api/v1/modules/{slug} | Hayır | Modül detayı |
| GET | /api/v1/modules/{module_id}/progress | Evet | Kullanıcı ilerleme bilgisi |

### Dersler

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | /api/v1/lessons/module/{module_id} | Evet | Modüle ait dersler |
| GET | /api/v1/lessons/{lesson_id} | Evet | Ders detayı + sorular |
| POST | /api/v1/lessons/{lesson_id}/submit | Evet | Ders cevaplarını gönder |

### Seviye Testi

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | /api/v1/placement/{module_slug} | Evet | 15 soruluk seviye testi |
| POST | /api/v1/placement/{module_slug}/submit | Evet | Cevapları gönder ve yerleştir |

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

---

## Geliştirme Takvimi

### Hafta 1 — Proje Kurulumu ve Altyapı

- [x] Monorepo klasör yapısının oluşturulması
- [x] GitHub repository ve branch stratejisi
- [x] Docker Compose ile PostgreSQL ve Redis'in ayağa kaldırılması
- [x] .env yapısı ve ortam değişkenlerinin tanımlanması

### Hafta 3 — Modül, Ders ve Seviye Testi API'leri

- [x] Module, Lesson, Question repository katmanı
- [x] Module, Lesson, Placement servis katmanı
- [x] Pydantic şemalar (module, lesson, question, progress)
- [x] Modül, ders ve seviye testi endpoint'leri
- [x] Akıllı seviye yerleştirme algoritması
- [x] Python, DevOps, Cloud seed verisi (3 modül × 5 ders × 4 soru)

### Hafta 4 — Gamification Backend

- [x] XP kazanma ve seviye hesaplama algoritması
- [x] Streak takip mekanizması (36 saatlik donma süresi)
- [x] Rozet kazanma sistemi (6 farklı rozet)
- [x] Redis üzerinde haftalık liderboard
- [x] Gamification endpoint'leri

## Gamification Sistemi Nasıl Çalışır?

**XP ve Seviye:**
Her ders tamamlandığında ders.xp_reward kadar XP kazanılır.
7+ günlük streak varsa %50 bonus, 30+ günlük streak varsa %125 bonus uygulanır.
Her 100 XP'de bir seviye atlanır (maksimum 50. seviye).

**Streak:**
Her gün uygulama açıldığında streak güncellenir.
36 saat içinde giriş yapılmazsa streak sıfırlanır.
7 ve 30 günlük streakler rozet kazandırır.

**Liderboard:**
Haftalık XP bazlı sıralama Redis'te tutulur.
Her pazartesi otomatik sıfırlanır.
İlk 100 kullanıcı gösterilir.

### Gamification API Endpoint'leri

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | /api/v1/gamification/leaderboard | Evet | Haftalık liderboard |
| GET | /api/v1/gamification/stats | Evet | Kullanıcı istatistikleri |
| GET | /api/v1/gamification/badges | Evet | Kazanılan rozetler |
| GET | /api/v1/gamification/level-progress | Evet | Seviye ilerlemesi |
| GET | /api/v1/gamification/streak | Evet | Streak bilgisi |

### Hafta 5 — Flutter Kurulum ve Auth Ekranları

- [x] Flutter projesi kurulumu ve Clean Architecture klasör yapısı
- [x] Riverpod state yönetimi entegrasyonu
- [x] Go_router navigasyon sistemi
- [x] Dio HTTP istemci + token interceptor
- [x] JWT token yönetimi (flutter_secure_storage)
- [x] Giriş ve kayıt ekranları
- [x] Otomatik token yenileme (refresh interceptor)

## Flutter Kurulum

```bash
cd mobile/coderun_mobile
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run
```
