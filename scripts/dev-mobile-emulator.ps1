# Coderun — Android emülatörde geliştirme (10.0.2.2 = host makine).

param([int]$BackendPort = 8000)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$MobileDir = Join-Path $Root "mobile\coderun_mobile"

$apiUrl = "http://10.0.2.2:${BackendPort}/api/v1"

Write-Host "==> Emülatör API: $apiUrl" -ForegroundColor Cyan

Push-Location $MobileDir
try {
    flutter pub get | Out-Null
    flutter run `
        --dart-define=API_BASE_URL=$apiUrl `
        --dart-define=SKIP_FIREBASE=true
}
finally {
    Pop-Location
}
