#!/usr/bin/env bash
# Docker tam sıfırlama + güncel UI (Unix)
# Kullanım: bash scripts/dev-docker-rebuild.sh
# Opsiyonel: SKIP_BUILD=1 bash scripts/dev-docker-rebuild.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

POSTGRES_USER="${POSTGRES_USER:-coderun}"
POSTGRES_DB="${POSTGRES_DB:-coderun}"

wait_db() {
  echo "PostgreSQL hazır bekleniyor..."
  local i=0
  while [[ $i -lt 45 ]]; do
    if docker compose exec -T db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
    i=$((i + 1))
  done
  echo "PostgreSQL hazır olmadı." >&2
  exit 1
}

wait_http() {
  local url="$1"
  local label="$2"
  echo "$label bekleniyor ($url)..."
  local i=0
  while [[ $i -lt 40 ]]; do
    if curl -sf -o /dev/null "$url"; then
      echo "$label hazır."
      return 0
    fi
    sleep 3
    i=$((i + 1))
  done
  echo "$label hazır olmadı: $url" >&2
  exit 1
}

wait_backend_health() {
  echo "Backend sağlık kontrolü..."
  local i=0
  while [[ $i -lt 40 ]]; do
    if curl -sf "http://localhost:8000/health" | grep -qE '"database"\s*:\s*"ok"'; then
      echo "Backend sağlıklı."
      return 0
    fi
    sleep 3
    i=$((i + 1))
  done
  echo "Backend sağlık kontrolü başarısız. docker logs coderun-backend-1" >&2
  exit 1
}

echo "=== Coderun Docker rebuild ==="

docker compose down -v
rm -rf web/coderun-web/.next 2>/dev/null || true

if [[ "${SKIP_BUILD:-}" != "1" ]]; then
  echo "İmajlar derleniyor..."
  docker compose build --no-cache web backend
fi

docker compose up -d db redis
wait_db

echo "Migration + seed..."
docker compose run --rm --no-deps backend python -m alembic upgrade head
docker compose run --rm --no-deps backend python -m app.core.reset_seed
docker compose run --rm --no-deps -e ENVIRONMENT=development backend python -m app.core.create_dev_admin

docker compose up -d backend web
wait_backend_health
wait_http "http://localhost:3000/login" "Web"

echo ""
echo "=== Tamamlandı ==="
echo "Web:    http://localhost:3000"
echo "API:    http://localhost:8000/health"
echo "Admin:  admin@coderun.com / admin123"
