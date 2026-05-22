#!/bin/sh
set -eu

ROOT_DIR=/app
BACKEND_DIR="$ROOT_DIR/backend"

export LEDGERLIFT_API_BASE_URL="${LEDGERLIFT_API_BASE_URL:-/api}"
export LEDGERLIFT_INTERNAL_API_BASE_URL="${LEDGERLIFT_INTERNAL_API_BASE_URL:-http://127.0.0.1:8001/api}"

cleanup() {
    kill "${PROXY_PID:-0}" "${GUNICORN_PID:-0}" "${PHP_PID:-0}" 2>/dev/null || true
}

wait_for_url() {
    python - "$1" <<'PY'
import sys
import time
import urllib.request

url = sys.argv[1]
deadline = time.time() + 60
headers = {'X-Forwarded-Proto': 'https'} if url.startswith('http://127.0.0.1:8001/') else {}

while time.time() < deadline:
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=2) as response:
            if response.status < 500:
                raise SystemExit(0)
    except Exception:
        time.sleep(0.5)

raise SystemExit(1)
PY
}

trap cleanup EXIT INT TERM

echo "Starting LedgerLift live proxy..."
python "$ROOT_DIR/render/live_proxy.py" &
PROXY_PID=$!
echo "Proxy PID: $PROXY_PID"
sleep 2

cd "$BACKEND_DIR"
echo "Running migrations..."
timeout 120 python manage.py migrate --noinput 2>&1 | head -100 || echo "Migrations timed out or failed, continuing..."

# Skip seeding on Render by default to avoid conflicts with existing data
if [ "${LEDGERLIFT_SEED_ON_START:-0}" = "1" ]; then
    echo "Seeding demo data..."
    timeout 60 python manage.py seed_demo_data 2>&1 | head -100 || echo "Seed data timed out or failed, continuing..."
else
    echo "Skipping demo data seed (set LEDGERLIFT_SEED_ON_START=1 to enable)"
fi

echo "Starting gunicorn..."
gunicorn ledgerlift_backend.wsgi:application --bind 127.0.0.1:8001 --access-logfile - --error-logfile - &
GUNICORN_PID=$!
echo "Gunicorn PID: $GUNICORN_PID"

cd "$ROOT_DIR"
echo "Starting PHP server..."
php -S 127.0.0.1:8088 -t "$ROOT_DIR" &
PHP_PID=$!
echo "PHP PID: $PHP_PID"

echo "Services started. Waiting for backend to be ready..."
wait_for_url "http://127.0.0.1:8001/api/health/" || echo "Backend health check timeout, but continuing..."
echo "Backend ready. Waiting for frontend..."
wait_for_url "http://127.0.0.1:8088/" || echo "Frontend health check timeout, but continuing..."
echo "All services running. Live proxy is handling requests."

wait "$PROXY_PID"