#!/bin/sh
set -eu

ROOT_DIR=/app
BACKEND_DIR="$ROOT_DIR/backend"

export LEDGERLIFT_API_BASE_URL="${LEDGERLIFT_API_BASE_URL:-/api}"
export LEDGERLIFT_INTERNAL_API_BASE_URL="${LEDGERLIFT_INTERNAL_API_BASE_URL:-http://127.0.0.1:8001/api}"

cleanup() {
    kill "${GUNICORN_PID:-0}" "${PHP_PID:-0}" 2>/dev/null || true
}

wait_for_url() {
    python - "$1" <<'PY'
import sys
import time
import urllib.request

url = sys.argv[1]
deadline = time.time() + 60

while time.time() < deadline:
    try:
        with urllib.request.urlopen(url, timeout=2) as response:
            if response.status < 500:
                raise SystemExit(0)
    except Exception:
        time.sleep(0.5)

raise SystemExit(1)
PY
}

trap cleanup EXIT INT TERM

cd "$BACKEND_DIR"
python manage.py migrate --noinput

if [ "${LEDGERLIFT_SEED_ON_START:-1}" = "1" ]; then
    python manage.py seed_demo_data
fi

gunicorn ledgerlift_backend.wsgi:application --bind 127.0.0.1:8001 --access-logfile - --error-logfile - &
GUNICORN_PID=$!

cd "$ROOT_DIR"
php -S 127.0.0.1:8088 -t "$ROOT_DIR" &
PHP_PID=$!

wait_for_url "http://127.0.0.1:8001/api/health/"
wait_for_url "http://127.0.0.1:8088/"

exec python "$ROOT_DIR/render/live_proxy.py"