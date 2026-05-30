# Docker tam sıfırlama + güncel UI (PowerShell)
# Kullanım: .\scripts\dev-docker-rebuild.ps1
# Opsiyonel: .\scripts\dev-docker-rebuild.ps1 -SkipBuild

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

function Wait-DbReady {
    param([int]$MaxSeconds = 90)
    Write-Host "PostgreSQL hazır bekleniyor..." -ForegroundColor Yellow
    $deadline = (Get-Date).AddSeconds($MaxSeconds)
    while ((Get-Date) -lt $deadline) {
        docker compose exec -T db pg_isready -U $env:POSTGRES_USER -d $env:POSTGRES_DB 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { return }
        Start-Sleep -Seconds 2
    }
    throw "PostgreSQL hazır olmadı (${MaxSeconds}s timeout). .env içinde POSTGRES_* değerlerini kontrol edin."
}

function Wait-HttpOk {
    param(
        [string]$Url,
        [string]$Label,
        [int]$MaxSeconds = 120
    )
    Write-Host "$Label bekleniyor ($Url)..." -ForegroundColor Yellow
    $deadline = (Get-Date).AddSeconds($MaxSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
                Write-Host "$Label hazır." -ForegroundColor Green
                return
            }
        } catch {
            # retry
        }
        Start-Sleep -Seconds 3
    }
    throw "$Label hazır olmadı (${MaxSeconds}s): $Url"
}

function Wait-BackendHealthy {
    param([int]$MaxSeconds = 120)
    Write-Host "Backend sağlık kontrolü..." -ForegroundColor Yellow
    $deadline = (Get-Date).AddSeconds($MaxSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
            if ($r.status -eq "ok" -and $r.database -eq "ok") {
                Write-Host "Backend sağlıklı." -ForegroundColor Green
                return
            }
        } catch {
            # retry
        }
        Start-Sleep -Seconds 3
    }
    throw "Backend sağlık kontrolü başarısız. Log: docker logs coderun-backend-1"
}

Write-Host "=== Coderun Docker rebuild ===" -ForegroundColor Cyan

Set-Location $Root

# .env yükle (POSTGRES_* için)
if (Test-Path "$Root\.env") {
    Get-Content "$Root\.env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            Set-Item -Path "env:$name" -Value $value
        }
    }
}
if (-not $env:POSTGRES_USER) { $env:POSTGRES_USER = "coderun" }
if (-not $env:POSTGRES_DB) { $env:POSTGRES_DB = "coderun" }

docker compose down -v
Remove-Item -Recurse -Force "$Root\web\coderun-web\.next" -ErrorAction SilentlyContinue

if (-not $SkipBuild) {
    Write-Host "İmajlar derleniyor (--no-cache)..." -ForegroundColor Yellow
    docker compose build --no-cache web backend
} else {
    Write-Host "Derleme atlandı (-SkipBuild)." -ForegroundColor Yellow
}

Write-Host "db + redis başlatılıyor..." -ForegroundColor Yellow
docker compose up -d db redis
Wait-DbReady

Write-Host "Migration + seed (backend one-shot)..." -ForegroundColor Yellow
docker compose run --rm --no-deps backend python -m alembic upgrade head
if ($LASTEXITCODE -ne 0) { throw "alembic upgrade head başarısız" }

docker compose run --rm --no-deps backend python -m app.core.reset_seed
if ($LASTEXITCODE -ne 0) { throw "reset_seed başarısız" }

Write-Host "Dev admin oluşturuluyor (admin@coderun.com / admin123)..." -ForegroundColor Yellow
docker compose run --rm --no-deps -e ENVIRONMENT=development backend python -m app.core.create_dev_admin
if ($LASTEXITCODE -ne 0) { throw "create_dev_admin başarısız" }

Write-Host "backend + web başlatılıyor..." -ForegroundColor Yellow
docker compose up -d backend web
Wait-BackendHealthy
Wait-HttpOk -Url "http://localhost:3000/login" -Label "Web"

Write-Host ""
Write-Host "=== Tamamlandı ===" -ForegroundColor Green
Write-Host "Web:    http://localhost:3000" -ForegroundColor White
Write-Host "API:    http://localhost:8000" -ForegroundColor White
Write-Host "Health: http://localhost:8000/health" -ForegroundColor White
Write-Host "Admin:  admin@coderun.com / admin123" -ForegroundColor White
Write-Host "Demo kilidi: .\scripts\dev-unlock-python-lessons.ps1 -Email you@example.com" -ForegroundColor White
