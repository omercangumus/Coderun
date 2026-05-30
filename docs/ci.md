# Coderun CI/CD

Yetkili pipeline: **GitHub Actions** (`.github/workflows/`).

## İşler

| İş | Tetikleyici | Ne doğrular |
|----|-------------|-------------|
| Backend CI | `backend/**` | ruff, compileall, alembic heads, pytest (SQLite) |
| Web CI | `web/**` | `npm ci`, lint, production build |
| Mobile CI | `mobile/**` | Flutter 3.29.3, build_runner, analyze, unit/widget test |
| Runtime CI | backend/web/compose/scripts | Docker boot, migrate, seed, HTTP smoke |

## Ortam değişkenleri (Backend CI)

| Değişken | Değer |
|----------|--------|
| `DATABASE_URL` | `sqlite+aiosqlite:///./tests/test_auth.db` |
| `REDIS_URL` | `redis://localhost:6379/0` |
| `SECRET_KEY` | test anahtarı (workflow içinde) |
| `ENVIRONMENT` | `test` |
| `OPENROUTER_API_KEY` | test placeholder |

## Web CI

`NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` (build zamanı).

## Mobile CI

- Flutter **3.29.3** (stable)
- `video_player` pin: `>=2.10.1 <2.11.0` (Dart SDK uyumu)
- **`mobile/coderun_mobile/pubspec.lock` commit edilir** — kök `.gitignore` içinde `*.lock` istisnası ile
- `flutter analyze --no-fatal-infos` (speech_to_text deprecation uyarıları)
- Kod lab sekmeleri: `test/widgets/code_assignment_widget_test.dart`

## Runtime CI

Workflow: `.github/workflows/runtime-ci.yml`

Sıra:

1. `docker compose build backend web`
2. `up db redis` → `pg_isready`
3. `alembic upgrade head` → `reset_seed` → `create_dev_admin` (one-shot)
4. `up backend web` → `/health` + `scripts/runtime-smoke.sh`

Başarısızlıkta `runtime-ci-logs` artifact (compose log).

Playwright ekran görüntüleri **CI'da çalışmaz** (ağır); yerelde `scripts/qa`.

## Code runner

Tam Docker sandbox CI'da yok; `test_code_runner_service.py` mock kullanır.

## Yerelde CI komutları

```powershell
# Backend
cd backend
$env:ENVIRONMENT="test"
$env:DATABASE_URL="sqlite+aiosqlite:///./tests/test_auth.db"
$env:REDIS_URL="redis://localhost:6379/0"
$env:SECRET_KEY="test-secret-key-for-ci-only-32chars"
$env:OPENROUTER_API_KEY="test-openrouter-key-for-ci-only"
pip install -r requirements.txt
ruff check app/
python -m compileall app
python -m alembic heads
pytest tests/ -q

# Web
cd web/coderun-web
npm ci
$env:NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
npm run lint
npm run build

# Mobile
cd mobile/coderun_mobile
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze --no-fatal-infos
flutter test

# Runtime (Docker Desktop gerekir)
.\scripts\dev-docker-rebuild.ps1
bash scripts/runtime-smoke.sh
```

## Gizli anahtarlar

Runtime CI için GitHub Secrets gerekmez (`.env` workflow içinde üretilir).

## Sorun giderme

| Belirti | Çözüm |
|---------|--------|
| Backend `unhealthy`, `relation "modules" does not exist` | Migration önce: `dev-docker-rebuild.ps1` veya `alembic upgrade head` |
| Mobile `pub get` drift | `pubspec.lock` commit edilmiş olmalı; `flutter pub get` |
| Runtime CI timeout | Docker imaj cache; workflow 45 dk limit |
