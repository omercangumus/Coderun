# Docker tam sıfırlama + güncel UI (PowerShell)
# Kullanım: .\scripts\dev-docker-rebuild.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Coderun Docker rebuild ===" -ForegroundColor Cyan

Set-Location $Root
docker compose down -v
Remove-Item -Recurse -Force "$Root\web\coderun-web\.next" -ErrorAction SilentlyContinue

Write-Host "Building images (no cache)..." -ForegroundColor Yellow
docker compose build --no-cache web backend

Write-Host "Starting db + redis..." -ForegroundColor Yellow
docker compose up -d db redis
Write-Host "Waiting for database..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Migrations + seed (inside backend container)..." -ForegroundColor Yellow
docker compose run --rm backend python -m alembic upgrade head
docker compose run --rm backend python -m app.core.reset_seed

Write-Host "Creating dev admin (admin@coderun.com / admin123)..." -ForegroundColor Yellow
docker compose run --rm -e ENVIRONMENT=development backend python -m app.core.create_dev_admin

Write-Host "Starting backend + web..." -ForegroundColor Yellow
docker compose up -d backend web
Start-Sleep -Seconds 20
docker compose restart backend 2>$null

Write-Host "Done. Web: http://localhost:3000  API: http://localhost:8000" -ForegroundColor Green
Write-Host "Admin: admin@coderun.com / admin123" -ForegroundColor Green
Write-Host "Demo kilidi: .\scripts\dev-unlock-python-lessons.ps1 -Email you@example.com" -ForegroundColor Green
