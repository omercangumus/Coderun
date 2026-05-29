# Coderun — Yerel Geliştirme Runbook

Güncel UI, 26 derslik Python müfredatı ve tema sistemini görmek için aşağıdaki adımları izleyin.

## 1. Veritabanı

```bash
cd backend
python -m alembic upgrade head
python -m app.core.reset_seed
```

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

- Ana sayfa: http://localhost:3000
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

## Beklenen durum

- Python modülünde **26 ders** (6 ünite, son ünite: Python Kodlama Ödevleri)
- Web temaları: `light`, `dark`, `coderun-comfort` — Profil sayfasından değiştirilir
- Ghostie animasyonları aktif rotalarda görünür (öğrenme yolu, ders, rozetler, liderboard)
