# [DEV ONLY] Python kodlama lab dersini test etmek için önceki dersleri tamamlar.
# Production'da kullanmayın.

param(
    [Parameter(Mandatory = $true)]
    [string]$Email,
    [int]$UpToOrder = 0
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $repoRoot "backend"

$env:ENVIRONMENT = "development"
if (-not $env:DATABASE_URL) {
    $env:DATABASE_URL = "postgresql+asyncpg://coderun:coderun@localhost:5432/coderun"
}

Push-Location $backend
try {
    $args = @("-m", "app.core.dev_unlock_lessons", "--email", $Email)
    if ($UpToOrder -gt 0) {
        $args += @("--up-to-order", "$UpToOrder")
    }
    python @args
} finally {
    Pop-Location
}
