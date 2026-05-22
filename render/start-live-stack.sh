#!/bin/sh

ROOT_DIR=/app
BACKEND_DIR="$ROOT_DIR/backend"

export LEDGERLIFT_API_BASE_URL="${LEDGERLIFT_API_BASE_URL:-/api}"
export LEDGERLIFT_INTERNAL_API_BASE_URL="${LEDGERLIFT_INTERNAL_API_BASE_URL:-http://127.0.0.1:8001/api}"

cleanup() {
    echo "Cleaning up services..."
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

echo "=== LedgerLift Live Stack Startup ==="
echo "Starting LedgerLift live proxy..."
python "$ROOT_DIR/render/live_proxy.py" 2>&1 &
PROXY_PID=$!
echo "✓ Proxy started (PID: $PROXY_PID)"
sleep 3

cd "$BACKEND_DIR"
echo "Running database migrations..."
if timeout 120 python manage.py migrate --noinput 2>&1 | head -100; then
    echo "✓ Migrations completed"
else
    echo "⚠ Migrations failed or timed out, continuing anyway..."
fi

# Skip seeding on Render by default to avoid conflicts with existing data
if [ "${LEDGERLIFT_SEED_ON_START:-0}" = "1" ]; then
    echo "Seeding demo data..."
    if timeout 60 python manage.py seed_demo_data 2>&1 | head -100; then
        echo "✓ Demo data seeded"
    else
        echo "⚠ Seed data failed or timed out, continuing anyway..."
    fi
else
    echo "Skipping demo data seed (set LEDGERLIFT_SEED_ON_START=1 to enable)"
fi

echo "Starting gunicorn backend server..."
gunicorn ledgerlift_backend.wsgi:application --bind 127.0.0.1:8001 --workers 2 --access-logfile - --error-logfile - 2>&1 &
GUNICORN_PID=$!
echo "✓ Gunicorn started (PID: $GUNICORN_PID)"

cd "$ROOT_DIR"
echo "Starting PHP frontend server..."
php -S 127.0.0.1:8088 -t "$ROOT_DIR" 2>&1 &
PHP_PID=$!
echo "✓ PHP started (PID: $PHP_PID)"

echo ""
echo "=== Waiting for services to be ready ==="
wait_for_url "http://127.0.0.1:8001/api/health/" || echo "⚠ Backend health check timed out, proxy may report degraded service initially"
wait_for_url "http://127.0.0.1:8088/" || echo "⚠ Frontend health check timed out, proxy may report degraded service initially"

echo ""
echo "=== Services are running ==="
echo "Proxy listening on PORT (forwarding to backend:8001 and frontend:8088)"
echo "Ready to accept requests."
echo ""

wait "$PROXY_PID"