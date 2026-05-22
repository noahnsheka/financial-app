FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends php-cli \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY . /app

RUN chmod +x /app/render/start-live-stack.sh

CMD ["/app/render/start-live-stack.sh"]
