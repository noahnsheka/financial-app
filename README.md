# LedgerLift Uganda MVP

LedgerLift Uganda is a lightweight PHP MVP for a government-facing fintech pilot focused on informal businesses such as small retail shops. It shows how mobile money activity, stock visibility, and simple credit scoring can sit in one web experience.

## Stack

Render deployment is now designed around a single Dockerized web service that exposes the PHP frontend and the Django API on the same public host.
- HTML and CSS
- Chart.js via CDN

This repo includes `render.yaml` so Render can create the unified web service and PostgreSQL database with one blueprint deploy.

- `index.php` routes the requested page.
- `app/data.php` loads public dashboard, credit, and government bootstrap data from the Django API.
- `app/views/` contains page templates.
- `app/partials/` contains shared layout markup.
- `assets/` contains custom CSS and JavaScript.
- `backend/` contains the Django API for authentication, business registration, platform bootstrap data, and owner workspace persistence.

## Run Locally
- Health Check Path: `/api/health/`

Render environment variables:
	- `python manage.py makemigrations registry`
	- `python manage.py migrate`
	- `python manage.py seed_demo_data`
	- `python manage.py runserver 127.0.0.1:8001`
3. Open `http://127.0.0.1:8088` in your browser.
- `LEDGERLIFT_API_BASE_URL=/api`
- `LEDGERLIFT_INTERNAL_API_BASE_URL=http://127.0.0.1:8001/api`

### Local Notes

- The main app uses the Django SQLite database at `backend/db.sqlite3` by default.
- `run-local.ps1` starts the frontend on `127.0.0.1:8088` because port `8000` commonly conflicts with other local services.
- `DJANGO_ALLOWED_HOSTS=financial-app.onrender.com,127.0.0.1,localhost`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `LEDGERLIFT_ALLOWED_ORIGINS=https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
## GitHub Pages Demo

The live public host should be `https://financial-app.onrender.com`, with the frontend calling `/api/...` on that same origin instead of a second public backend hostname.

- `docs/index.html` is the Pages entry point.
- `docs/assets/js/demo.js` renders the static app shell and loads the shared frontend runtime.
- `docs/assets/js/app.js` is a copied runtime build used by the Pages preview.
- `docs/assets/css/app.css` is a copied stylesheet used by the Pages preview.
- `docs/assets/data/*.json` contains database-exported snapshot data for public pages and preview sessions.
- `.github/workflows/deploy-pages.yml` deploys the `docs/` folder through GitHub Actions.

### Demo Behavior

- Public dashboard, registry, credit, government, and owner-workspace preview pages render from snapshot files exported out of the Django database.
- Sign-in and save actions are disabled on Pages, so writes still require the local stack or a repaired live deployment.
- The Pages build no longer depends on the broken Render hostname to open the app shell.
- The signed ledger protection and live mutations still apply only to the Django-backed app.

### Publishing

1. Push the repo to GitHub.
2. In the repository settings, set GitHub Pages to deploy from GitHub Actions.
3. The `Deploy Pages Demo` workflow will publish the `docs/` folder.

This keeps the local PHP and Django app available for full development while allowing GitHub Pages to remain a usable read-only preview when the live deployment host is unavailable.

## Render Deployment

Render deployment is now split into these services:

- The public app is a Dockerized PHP web service built from the repository root and serving `index.php`, `app/`, and `assets/`.
- `backend/` is the Django API service.

### Blueprint

This repo includes `render.yaml` so Render can create the PHP web service, Django web service, and PostgreSQL database with one blueprint deploy.

### Manual Render Values

Public app:

- Service type: `Web Service`
- Name: `financial-app`
- Environment: `Docker`
- Dockerfile Path: `./Dockerfile`
- Environment variable: `LEDGERLIFT_API_BASE_URL=https://ledgerlift-uganda-api.onrender.com/api`

Backend web service:

- Service type: `Web Service`
- Environment: `Python 3`
- Name: `ledgerlift-uganda-api`
- Branch: `main`
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_demo_data && python manage.py collectstatic --noinput`
- Start Command: `gunicorn ledgerlift_backend.wsgi:application --bind 0.0.0.0:$PORT`

Backend environment variables:

- `DJANGO_DEBUG=0`
- `DJANGO_SECRET_KEY=<generate a long random value>`
- `LEDGER_CHAIN_SECRET=<generate a second long random value reserved for ledger signing>`
- `LEDGER_CHAIN_KEY_ID=render-primary`
- `NIRA_API_BASE_URL=<agency-issued NIRA verification endpoint>`
- `NIRA_API_KEY=<agency-issued NIRA API key>`
- `NITA_API_BASE_URL=<agency-issued NITA verification endpoint>`
- `NITA_API_KEY=<agency-issued NITA API key>`
- `UGANDA_IDENTITY_API_TIMEOUT=8`
- `DJANGO_ALLOWED_HOSTS=ledgerlift-uganda-api.onrender.com`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://ledgerlift-uganda-api.onrender.com,https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `LEDGERLIFT_ALLOWED_ORIGINS=https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `DATABASE_URL=<Render PostgreSQL connection string>`

The currently observed public frontend hostname is `https://financial-app.onrender.com`. Keep the backend origin list aligned with that host if the existing Render service is reused instead of creating a new frontend service name.
Do not commit real NIRA or NITA credentials into the repository. Enter the live values directly in Render or your local environment file.
For local development, Django now reads `backend/.env` automatically before it resolves these settings.

## App Flow

- `Businesses` loads live registrations from the Django API.
- `Login` authenticates against Django user records and no longer exposes quick-fill credentials in the UI.
- `Workspace` shows a role-based control room for government, lender, field-agent, and business-owner users, with owner stock, document, and credit draft activity stored in the database.

## Local Seed Data

`python manage.py seed_demo_data` provisions sample official users, a linked owner account, public platform configuration, and database-backed business workspace data for local and deployment testing.

## SQL Search Result

I searched the accessible Desktop, Downloads, and Documents folders for `.sql` files. The most relevant match was [pos init.sql](c:\Users\noahs\OneDrive\Desktop\Noahs projects\pos\backend\php\database\init.sql), but it defines a separate MySQL POS schema (`pos_desktop`) with products, cashiers, and orders. It does not match this fintech registry backend, so it was not imported into the Django app.

## Suggested Next Steps

1. Switch the Django database settings to PostgreSQL once the schema or SQL dump is ready.
2. Add a URA tax lookup integration that validates the TIN and hydrates owner details.
3. Connect mobile money and stock records to actual shop activity.
4. Replace the remaining legacy `docs/` showcase with the live API-backed frontend if GitHub Pages parity still matters.