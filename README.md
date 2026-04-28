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

### Hafta 6 — Flutter Ana Ekranlar

- [x] Modül ve gamification data katmanı (model, datasource, repository, provider)
- [x] Ana sayfa: hoş geldin, XP bar, devam et, mini liderboard
- [x] Öğren sekmesi: modül kartları, ilerleme yüzdeleri, coming soon bölümü
- [x] Liderboard sekmesi: podium, tam liste, kullanıcı sırası
- [x] Profil sekmesi: istatistikler, streak, rozetler, çıkış
- [x] Öğrenme yolu ekranı: ders listesi, kilit/tamamlanma durumları
- [x] 7 tekrar kullanılabilir widget

## Ekran Yapısı

Ana Sayfa (Bottom Nav):
```
├── Ana Sayfa sekmesi (dashboard)
├── Öğren sekmesi (modül listesi)
├── Liderboard sekmesi (haftalık sıralama)
└── Profil sekmesi (kullanıcı bilgileri)
```

Öğrenme Yolu:
```
Ana Sayfa → Öğren → Modül Seç → LearningPathScreen → (Hafta 7'de) LessonScreen
```

## Bileşen Hiyerarşisi

```
HomeScreen
├── HomeTab
│   ├── StreakWidget
│   ├── XpProgressBar
│   ├── ModuleCard (devam et)
│   ├── StatCard x3
│   └── LeaderboardEntry x3
├── LearnTab
│   └── ModuleCard x N
├── LeaderboardTab
│   ├── Podium (top 3)
│   └── LeaderboardList
└── ProfileTab
    ├── StatCard x4
    ├── XpProgressBar
    ├── StreakWidget
    └── BadgeChip x N
```

## Hafta 7 — Flutter Ders Ekranları ve Bildirimler

### Bu Haftada Yapılanlar

- Ders detayı data katmanı (model, datasource, repository, provider)
- LessonScreen: soru tiplerine göre dinamik widget sistemi
- MultipleChoiceWidget: animasyonlu çoktan seçmeli soru
- CodeCompletionWidget: kod tamamlama alanı (monospace)
- MiniProjectWidget: çok satırlı proje görevi
- LessonResultScreen: XP animasyonu, seviye atlama, rozet
- FCM push bildirim kurulumu
- Mikrofon ile sesli cevap verme özelliği

### Ders Akışı

```
LearningPathScreen
└── LessonTile (tıkla)
    └── LessonScreen
        ├── MultipleChoiceWidget
        ├── CodeCompletionWidget
        └── MiniProjectWidget
        └── (Tamamla butonu)
            └── LessonResultScreen
                ├── Başarı: XP animasyonu + rozetler
                └── Başarısız: Tekrar dene
```

### Bildirim Sistemi

FCM ile push bildirim:
- Günlük streak hatırlatması
- Yeni içerik bildirimi
- Liderboard sıralama değişikliği (ilerleyen sürüm)

Yerel bildirimler:
- Uygulama açıkken foreground mesaj → local notification
- Streak tehlikede → manuel tetikleme

### Mikrofon Kullanımı

Desteklenen ekranlar:
- Kod tamamlama: sesli cevap
- Mini proje: sesli görev açıklaması

Dil: Türkçe (tr_TR locale)
İzin: İlk kullanımda permission_handler ile isteniyor

## Hafta 8 — Flutter Gamification UI ve Polish

### Bu Haftada Yapılanlar
- Rozet ekranı: tüm rozetler, kazanılanlar/kazanılmayanlar
- Rozet kazanma overlay animasyonu
- Seviye atlama kutlama overlay'i
- Streak milestone kutlaması (7 ve 30 gün)
- Liderboard podium animasyonu ve hafta sayacı
- Seviye testi (placement test) ekranı
- Günlük hatırlatma bildirimi zamanlaması
- Profil ekranı: avatar, grafik, bildirim ayarları
- Skeleton loading, empty state, haptic feedback

### Ekran Listesi (Toplam)
Auth: SplashScreen, LoginScreen, RegisterScreen
Ana Uygulama: HomeTab, LearnTab, LeaderboardTab, ProfileTab
Öğrenme Akışı: PlacementScreen, LearningPathScreen, LessonScreen, LessonResultScreen
Diğer: BadgesScreen
Overlay'ler: BadgeEarnedOverlay, LevelUpOverlay, StreakMilestoneOverlay

## Hafta 9 — Next.js Kurulum ve Dashboard

### Bu Haftada Yapılanlar

- Next.js 14 App Router kurulumu (TypeScript + Tailwind CSS)
- TypeScript tip tanımları (auth, modül, gamification)
- Axios client + token interceptor + auto-refresh (401 → refresh)
- Cookie tabanlı JWT auth (middleware ile route koruması)
- Zustand auth store (persist middleware ile localStorage sync)
- TanStack Query ile server state yönetimi
- Giriş ve kayıt sayfaları (react-hook-form + zod validasyon)
- Dashboard: hoş geldin, XP bar, streak, istatistikler, modüller, liderboard özeti
- Öğren sayfası: modül kartları + coming soon bölümü
- Liderboard sayfası: podium + tam liste + kullanıcı sırası
- Profil sayfası: istatistikler, streak, rozetler, çıkış
- Ders sayfası: çoktan seçmeli sorular + cevap gönderme
- Yeniden kullanılabilir UI bileşenleri (button, input, card, progress, skeleton, avatar, badge)

### Web Kurulumu

```bash
cd web/coderun-web
npm install
cp .env.example .env.local
npm run dev
```

Uygulama: http://localhost:3000
Backend (gerekli): http://localhost:8000

### Mimari Kararlar

**Neden cookie tabanlı auth?**
localStorage XSS saldırılarına açık. Middleware'de `NextRequest.cookies` ile token okunabilmesi için js-cookie ile normal cookie tercih edildi.

**Neden TanStack Query?**
Otomatik cache, stale time, refetch yönetimi. Loading/error state'leri otomatik. Zustand ile birlikte kullanım: auth state Zustand, server state TanStack Query.

**Neden Zustand?**
Redux'tan çok daha az boilerplate. persist middleware ile localStorage sync. TypeScript desteği mükemmel.

**snake_case → camelCase dönüşümü**
Backend Python snake_case döndürüyor, frontend TypeScript camelCase kullanıyor. API katmanında mapper fonksiyonlarla dönüşüm yapılıyor.


## Hafta 10 — Web Ders Ekranları ve Lab Ortamı

### Bu Haftada Yapılanlar
- Öğrenme yolu sayfası: ders listesi, kilit/tamamlanma durumları, ilerleme bar'ı
- Ders ekranı: çoktan seçmeli, kod tamamlama, mini proje soruları
- Ders sonuç sayfası: XP animasyonu, rozet bildirimi, seviye atlama
- Lab ortamı: simüle terminal + Monaco Editor
- AI Mentor sidebar (mock, Hafta 11'de Groq bağlanacak)
- Seviye testi sayfası (placement test) — 3 adımlı akış
- Rozet sayfası: kazanılan/kilitli rozetler

### Web Sayfa Yapısı (Toplam)

**Auth:**
- `/login` — Giriş
- `/register` — Kayıt

**Dashboard:**
- `/` — Ana sayfa (özet istatistikler)
- `/learn` — Modül listesi
- `/learn/[moduleSlug]` — Öğrenme yolu (ders listesi)
- `/learn/[moduleSlug]/placement` — Seviye testi
- `/learn/[moduleSlug]/lesson/[lessonId]` — Ders ekranı
- `/learn/[moduleSlug]/lesson/[lessonId]/result` — Ders sonuç
- `/learn/[moduleSlug]/lesson/[lessonId]/lab` — Lab ortamı
- `/leaderboard` — Liderboard
- `/badges` — Rozetlerim
- `/profile` — Profil

### Lab Ortamı Hakkında

**Terminal:** Simüle edilmiş bash terminal (gerçek Docker container bağlantısı ilerleyen sürümde).

**Desteklenen komutlar:**
- `ls` — Dosya listesi
- `cat [dosya]` — Dosya içeriği
- `python [dosya]` — Python çalıştır
- `docker build`, `docker run` — Docker komutları
- `git init`, `git status`, `git add`, `git commit` — Git komutları
- `clear` — Ekranı temizle
- `help` — Komut listesi

**Editör:** Monaco Editor (VS Code motoru).

**Mock dosya sistemi:** `app.py`, `Dockerfile`, `requirements.txt`

### Teknolojiler

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Zustand (state management)
- Monaco Editor (kod editörü)
- react-hot-toast (bildirimler)

**Backend:**
- FastAPI
- PostgreSQL + asyncpg
- Redis (liderboard)
- SQLAlchemy 2.0 (async)
- Alembic (migrations)
- Groq AI (mentor)

**Mobile:**
- Flutter 3.x
- Riverpod (state management)
- Dio (HTTP client)
