# Coderun — USB ile bağlı Android tablet/telefonda geliştirme.
# PC'deki backend (port 8000) tablet üzerinden localhost gibi erişilir (adb reverse).
#
# Önkoşul:
#   1. USB hata ayıklama açık, cihaz bağlı (adb devices)
#   2. Backend çalışıyor: cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

param(
    [int]$BackendPort = 8000,
    [string]$DeviceId = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$MobileDir = Join-Path $Root "mobile\coderun_mobile"
$HealthUrl = "http://127.0.0.1:${BackendPort}/health"

Write-Host "==> Coderun mobil (USB) geliştirme" -ForegroundColor Cyan

# Backend kontrolü
Write-Host "==> Backend health kontrolü: $HealthUrl" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 5 -Method Get
    Write-Host "    Backend OK — status: $($health.status), db: $($health.database)" -ForegroundColor Green
} catch {
    Write-Host "    HATA: Backend calismiyor veya port $BackendPort kapali!" -ForegroundColor Red
    Write-Host "    Once su komutu calistir:" -ForegroundColor Yellow
    Write-Host "      cd backend" -ForegroundColor White
    Write-Host "      uvicorn app.main:app --reload --host 0.0.0.0 --port $BackendPort" -ForegroundColor White
    exit 1
}

$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
    Write-Host "adb bulunamadi. Android SDK platform-tools PATH'e ekleyin." -ForegroundColor Red
    exit 1
}

$devices = & adb devices | Select-String "device$"
if (-not $devices) {
    Write-Host "Bagli Android cihaz yok. USB hata ayiklama acik mi kontrol et." -ForegroundColor Red
    exit 1
}

Write-Host "==> Bagli cihaz:" -ForegroundColor Green
& adb devices -l

Write-Host "==> adb reverse tcp:${BackendPort} tcp:${BackendPort}" -ForegroundColor Yellow
& adb reverse "tcp:${BackendPort}" "tcp:${BackendPort}"

# Reverse dogrulama
$reverses = & adb reverse --list 2>$null
if ($reverses -match "tcp:${BackendPort}") {
    Write-Host "    adb reverse aktif" -ForegroundColor Green
} else {
    Write-Host "    UYARI: adb reverse dogrulanamadi" -ForegroundColor Yellow
}

# WiFi yedek IP (adb reverse olmadan kullanilabilir)
try {
    $lanIp = (Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } |
        Select-Object -First 1).IPAddress
    if ($lanIp) {
        Write-Host "    WiFi yedek (Profil > Geliştirici): http://${lanIp}:${BackendPort}/api/v1" -ForegroundColor DarkGray
    }
} catch {
    # Get-NetIPAddress yoksa atla
}

$apiUrl = "http://127.0.0.1:${BackendPort}/api/v1"
Write-Host "==> Mobil API: $apiUrl" -ForegroundColor Green
Write-Host "    Web ve mobil ayni backend'i kullanir." -ForegroundColor DarkGray

Push-Location $MobileDir
try {
    flutter pub get | Out-Null

    $flutterArgs = @(
        "run",
        "--dart-define=API_BASE_URL=$apiUrl",
        "--dart-define=SKIP_FIREBASE=true"
    )

    if ($DeviceId) {
        $flutterArgs += @("-d", $DeviceId)
    }

    Write-Host "==> flutter run baslatiliyor..." -ForegroundColor Cyan
    & flutter @flutterArgs
}
finally {
    Pop-Location
}
