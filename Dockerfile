FROM php:8.2-cli

WORKDIR /var/www/html
COPY index.php /var/www/html/index.php
COPY app /var/www/html/app
COPY assets /var/www/html/assets

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-10000} -t /var/www/html"]
