# Runtime UI QA Screenshots

Bu klasör, `scripts/qa/capture-runtime-ui.mjs` ile üretilen runtime ekran görüntülerini içerir.

## Gereksinimler

- Backend: http://localhost:8000 (healthy)
- Web: http://localhost:3000 (güncel imaj veya `npm run dev`)
- Admin: `admin@coderun.com` / `admin123`
- DB: `python -m app.core.reset_seed` sonrası 26 Python dersi

## Üretim

```powershell
cd scripts/qa
npm install
npx playwright install chromium
$env:GIT_COMMIT = git -C ../.. rev-parse HEAD
npm run capture
```

## Dosyalar

| Dosya | URL / Açıklama |
|-------|----------------|
| `web_learn.png` | `/learn` |
| `web_python_path.png` | `/learn/python` (light) |
| `web_python_path_dark.png` | `/learn/python` (dark) |
| `web_python_path_comfort.png` | `/learn/python` (comfort) |
| `web_badges.png` | `/badges` |
| `web_badges_comfort.png` | `/badges` (comfort) |
| `web_leaderboard.png` | `/leaderboard` |
| `web_leaderboard_comfort.png` | `/leaderboard` (comfort) |
| `web_profile_theme.png` | `/profile` |
| `web_lesson.png` | İlk Python dersi |
| `web_code_runner.png` | Python Kodlama Ödevleri |
| `capture-meta.json` | Git commit, ders sayısı, ders ID'leri |
