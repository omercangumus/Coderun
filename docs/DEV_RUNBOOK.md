# Coderun — Yerel Geliştirme Runbook

Güncel UI, 26 derslik Python müfredatı ve tema sistemini görmek için aşağıdaki adımları izleyin.

## Önemli: Docker ile çalışıyorsanız

Web konteyneri **production build** kullanır (`npm run build` imaja gömülür). UI değişikliklerini görmek için imajı yeniden oluşturmanız gerekir:

```powershell
# Tam sıfırlama (DB + önbellek + imaj)
docker compose down -v
Remove-Item -Recurse -Force web/coderun-web/.next -ErrorAction SilentlyContinue
docker compose build --no-cache web backend
docker compose up -d db redis
# DB hazır olunca (15 sn):
cd backend
python -m alembic upgrade head
python -m app.core.reset_seed
docker compose up -d backend web
```

Alternatif (en hızlı geliştirme): Web'i Docker dışında `npm run dev` ile çalıştırın; backend+db Docker'da kalabilir.

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

> **Not:** `seed.py` idempotenttir — mevcut modül varsa seed atlanır. Eski müfredat görüyorsanız `reset_seed` çalıştırın.

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

## Beklenen durum

- Python modülünde **26 ders** (6 ünite, son ünite: Python Kodlama Ödevleri)
- Web temaları: `light`, `dark`, `coderun-comfort` — Profil sayfasından değiştirilir
- Ghostie animasyonları aktif rotalarda görünür (öğrenme yolu, ders, rozetler, liderboard)
