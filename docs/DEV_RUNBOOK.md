# Coderun — Yerel Geliştirme Runbook

Güncel UI, **27 derslik** Python müfredatı ve tema sistemini görmek için aşağıdaki adımları izleyin.

## Önemli: Docker ile çalışıyorsanız

Web konteyneri **production build** kullanır. Fresh volume sonrası backend **migration olmadan** ayağa kalkarsa tablolar yoktur ve sağlıksız olur.

**Önerilen tek komut (sıfırdan güvenilir):**

```powershell
.\scripts\dev-docker-rebuild.ps1
```

Unix:

```bash
bash scripts/dev-docker-rebuild.sh
```

Script sırası: `down -v` → build → db/redis → **alembic** → **reset_seed** → **create_dev_admin** → backend/web → health bekler.

Hızlı geliştirme: Web'i Docker dışında `npm run dev`; backend+db Docker'da.

### Backend unhealthy (fresh volume)

1. Log: `docker logs coderun-backend-1` — `relation "modules" does not exist` → migration eksik
2. Çözüm: `.\scripts\dev-docker-rebuild.ps1` (manuel adım atlamayın)
3. Sadece migration: `docker compose run --rm --no-deps backend python -m alembic upgrade head`

## Tema localStorage

Web tema anahtarı: `coderun-settings` (zustand persist). Eski tema takılıysa:

1. DevTools → Application → Local Storage → `coderun-settings` silin, veya
2. Profil → Görünüm Teması → Açık / Koyu / Comfort seçin

## 1. Veritabanı

```bash
cd backend
python -m alembic upgrade head
python -m app.core.reset_seed
```

Admin kullanıcı (giriş için):

- E-posta: `admin@coderun.com`
- Şifre: `admin123`

Fresh DB sonrası admin oluşturma:

```powershell
docker compose run --rm -e ENVIRONMENT=development backend python -m app.core.create_dev_admin
```

> **Not:** `seed.py` idempotenttir — mevcut modül varsa seed atlanır. Eski müfredat görüyorsanız `reset_seed` çalıştırın.

## Kod çalıştırıcı (Code Runner)

Yerel geliştirmede kullanıcı kodu **Docker sandbox** içinde çalışır. Gereksinimler:

1. **Docker Desktop** açık ve çalışır durumda
2. Sandbox imajı: `docker pull python:3.11-slim`
3. `docker-compose.yml` backend servisinde:
   - `/var/run/docker.sock` mount
   - `user: "0:0"` (socket erişimi; yalnızca yerel geliştirme)

Kullanıcı kodu host bind-mount yerine **tmpfs + ortam değişkeni** ile sandbox'a aktarılır (Windows/macOS DooD uyumlu).

Backend imajını yeniden oluşturun (statik Docker CLI):

```powershell
docker compose build --no-cache backend
docker compose up -d backend
```

503 / "Docker'a erişemiyor" görürseniz: Docker Desktop'ı başlatın, ardından `docker compose restart backend`.

Test (API):

```powershell
# Önce giriş token alın, sonra POST /api/v1/code/run
```

Web: Python → **Python Kodlama Ödevleri** → **Hello Coderun** → **Çalıştır**

## Demo: Python ders kilidini açma (yalnızca geliştirme)

Kodlama laboratuvarı dersi sıralı kilitle açılır. Yerel test için önceki dersleri tamamlanmış işaretleyin:

```powershell
# Backend container veya yerel Python (ENVIRONMENT=development)
cd backend
$env:ENVIRONMENT = "development"
python -m app.core.dev_unlock_lessons --email kullanici@ornek.com

# veya kökten:
.\scripts\dev-unlock-python-lessons.ps1 -Email kullanici@ornek.com
```

> **Güvenlik:** Script `production` ortamında çalışmaz. Gerçek kullanıcı ilerlemesini etkilemez.

## 2. Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## 3. Web

```bash
cd web/coderun-web
npm install
npm run dev
```

Tarayıcıda açın:

- Öğrenme yolları: http://localhost:3000/learn
- Python öğrenme yolu: http://localhost:3000/learn/python
- Rozetler: http://localhost:3000/badges
- Liderboard: http://localhost:3000/leaderboard
- Profil / tema seçici: http://localhost:3000/profile

## 4. Mobile

```bash
cd mobile/coderun_mobile
flutter pub get
flutter run
```

Tema seçici: **Profil** sekmesi → **Görünüm Teması** (Açık / Koyu / Comfort)

## Runtime UI ekran görüntüleri

```powershell
cd scripts/qa
npm install
npx playwright install chromium
$env:GIT_COMMIT = git -C ../.. rev-parse HEAD
npm run capture
```

Çıktı: `docs/qa/runtime-ui/*.png`

## HTTP runtime smoke

Stack ayaktayken:

```bash
bash scripts/runtime-smoke.sh
```

## Admin dersler

`/admin/lessons?module=python` — gerçek `/admin/lessons` API (süper kullanıcı girişi gerekir).

## Mobil bağımlılıklar

`mobile/coderun_mobile/pubspec.lock` repoda tutulur. Değişiklikten sonra:

```bash
cd mobile/coderun_mobile && flutter pub get
```

## Beklenen durum

- Python modülünde **27 ders** (Hızlı Pratik + Kodlama Ödevleri dahil)
- Web temaları: `light`, `dark`, `coderun-comfort` — Profil sayfasından değiştirilir
- Ghostie animasyonları aktif rotalarda görünür (öğrenme yolu, ders, rozetler, liderboard)
