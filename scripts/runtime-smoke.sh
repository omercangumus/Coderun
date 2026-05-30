#!/usr/bin/env bash
# CI / yerel HTTP runtime smoke — Docker stack ayaktayken çalıştırın.
set -euo pipefail

API="${CODERUN_API_URL:-http://localhost:8000}"
WEB="${CODERUN_WEB_URL:-http://localhost:3000}"

echo "Smoke: backend health"
curl -sf "${API}/health" | grep -qE '"database"\s*:\s*"ok"'

echo "Smoke: web login"
curl -sf -o /dev/null "${WEB}/login"

echo "Smoke: web register"
curl -sf -o /dev/null "${WEB}/register"

echo "Smoke: web learn (redirect OK)"
code=$(curl -s -o /dev/null -w "%{http_code}" "${WEB}/learn")
[[ "$code" == "200" || "$code" == "307" || "$code" == "308" ]]

echo "Runtime smoke PASSED"
