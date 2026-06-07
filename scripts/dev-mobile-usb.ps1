# Coderun — USB ile bağlı Android tablet/telefonda geliştirme.
# PC'deki backend (port 8000) tablet üzerinden localhost gibi erişilir (adb reverse).
#
# Önkoşul:
#   1. USB hata ayıklama açık, cihaz bağlı (adb devices)
#   2. Backend çalışıyor: cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
#   3. Web (isteğe bağlı): cd web/coderun-web && npm run dev

param(
    [int]$BackendPort = 8000,
    [string]$DeviceId = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$MobileDir = Join-Path $Root "mobile\coderun_mobile"

Write-Host "==> Coderun mobil (USB) geliştirme" -ForegroundColor Cyan

$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
    Write-Host "adb bulunamadı. Android SDK platform-tools PATH'e ekleyin." -ForegroundColor Red
    exit 1
}

$devices = & adb devices | Select-String "device$"
if (-not $devices) {
    Write-Host "Bağlı Android cihaz yok. USB hata ayıklamayı açın ve kabloyu kontrol edin." -ForegroundColor Red
    exit 1
}

Write-Host "==> adb reverse tcp:${BackendPort} tcp:${BackendPort}" -ForegroundColor Yellow
& adb reverse "tcp:${BackendPort}" "tcp:${BackendPort}"

$apiUrl = "http://127.0.0.1:${BackendPort}/api/v1"
Write-Host "==> API: $apiUrl" -ForegroundColor Green
Write-Host "    Web ve mobil aynı backend'i kullanır — web'de yaptığın değişiklikler API üzerinden tablette görünür." -ForegroundColor DarkGray

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

    Write-Host "==> flutter $($flutterArgs -join ' ')" -ForegroundColor Cyan
    & flutter @flutterArgs
}
finally {
    Pop-Location
}
