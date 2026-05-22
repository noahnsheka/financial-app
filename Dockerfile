FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	LEDGERLIFT_API_BASE_URL=/api \
	LEDGERLIFT_INTERNAL_API_BASE_URL=http://127.0.0.1:8001/api

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends php-cli \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY . /app

RUN chmod +x /app/render/start-live-stack.sh

# Use the main startup script
CMD ["/app/render/start-live-stack.sh"]
