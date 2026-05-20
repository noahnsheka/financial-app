import os
from pathlib import Path

import dj_database_url


BASE_DIR = Path(__file__).resolve().parent.parent


def get_env_bool(name: str, default: bool = False) -> bool:
    raw_value = os.environ.get(name)

    if raw_value is None:
        return default

    return raw_value.strip().lower() in {'1', 'true', 'yes', 'on'}


def get_env_list(name: str, default: str = '') -> list[str]:
    return [value.strip() for value in os.environ.get(name, default).split(',') if value.strip()]


RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME', '').strip()
RENDER_EXTERNAL_URL = f'https://{RENDER_EXTERNAL_HOSTNAME}' if RENDER_EXTERNAL_HOSTNAME else ''
IS_RENDER = bool(os.environ.get('RENDER')) or bool(RENDER_EXTERNAL_HOSTNAME)

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-ledgerlift-mvp-dev')
DEBUG = get_env_bool('DJANGO_DEBUG', not IS_RENDER)

ALLOWED_HOSTS = get_env_list('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost')

if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

CSRF_TRUSTED_ORIGINS = get_env_list('DJANGO_CSRF_TRUSTED_ORIGINS')

if RENDER_EXTERNAL_URL and RENDER_EXTERNAL_URL not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(RENDER_EXTERNAL_URL)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'registry',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ledgerlift_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ledgerlift_backend.wsgi.application'
ASGI_APPLICATION = 'ledgerlift_backend.asgi.application'

database_url = os.environ.get('DATABASE_URL', '').strip()

if database_url:
    DATABASES = {
        'default': dj_database_url.parse(database_url, conn_max_age=600),
    }
elif os.environ.get('POSTGRES_DB') or os.environ.get('PGDATABASE'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB') or os.environ.get('PGDATABASE'),
            'USER': os.environ.get('POSTGRES_USER') or os.environ.get('PGUSER', ''),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD') or os.environ.get('PGPASSWORD', ''),
            'HOST': os.environ.get('POSTGRES_HOST') or os.environ.get('PGHOST', '127.0.0.1'),
            'PORT': os.environ.get('POSTGRES_PORT') or os.environ.get('PGPORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Kampala'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True

SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'