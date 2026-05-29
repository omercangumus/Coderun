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

docker compose up -d db redis
Write-Host "Waiting for database..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Set-Location "$Root\backend"
python -m alembic upgrade head
python -m app.core.reset_seed

Set-Location $Root
docker compose up -d backend web

Write-Host "Done. Web: http://localhost:3000  API: http://localhost:8000" -ForegroundColor Green
Write-Host "Admin: admin@coderun.com / admin123" -ForegroundColor Green
