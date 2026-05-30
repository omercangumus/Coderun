# Coderun CI/CD

Yetkili pipeline: **GitHub Actions** (`.github/workflows/`). GitLab CI kullanılmıyor.

## İşler

| İş | Tetikleyici | Komutlar |
|----|-------------|----------|
| Backend CI | `backend/**` | `ruff check`, `compileall`, `alembic heads`, `pytest -q` |
| Web CI | `web/**` | `npm ci`, `npm run lint`, `npm run build` |
| Mobile CI | `mobile/**` | `flutter pub get`, `build_runner`, `flutter analyze`, `flutter test` |

## Ortam değişkenleri (Backend CI)

| Değişken | Değer |
|----------|--------|
| `DATABASE_URL` | `sqlite+aiosqlite:///./tests/test_auth.db` |
| `REDIS_URL` | `redis://localhost:6379/0` |
| `SECRET_KEY` | test anahtarı (workflow içinde) |
| `ENVIRONMENT` | `test` |
| `OPENROUTER_API_KEY` | test placeholder |

Testler SQLite ile çalışır; Postgres servisi gerekmez. Redis servisi sağlık kontrolü ile ayağa kalkar (bazı testler bağlantı dener).

## Web CI

`NEXT_PUBLIC_API_URL` build sırasında `http://localhost:8000/api/v1` olarak ayarlanır (statik build için güvenli varsayılan).

## Mobile CI

- Flutter **3.24.5** (stable)
- `dart run build_runner build --delete-conflicting-outputs` her koşuda çalışır

## Code runner / Docker entegrasyonu

Tam sandbox (`docker run` ile kullanıcı kodu) CI'da **çalıştırılmaz**. `test_code_runner_service.py` Docker'ı mock'lar; birim testler deterministiktir.

## Yerelde CI ile aynı komutlar

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
flutter analyze
flutter test
```

## Gizli anahtarlar

CI için GitHub Secrets **gerekmez** (test env workflow içinde tanımlı). Production deploy ayrı yapılandırılır.

## Runtime / E2E (isteğe bağlı, yerel)

```powershell
docker compose down -v
docker compose build --no-cache backend web
docker compose up -d db redis backend web
cd backend
python -m alembic upgrade head
python -m app.core.reset_seed
```

Playwright: `scripts/qa` → `npm run capture`
