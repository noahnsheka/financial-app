# LedgerLift Uganda MVP

LedgerLift Uganda is a lightweight PHP MVP for a government-facing fintech pilot focused on informal businesses such as small retail shops. It shows how mobile money activity, stock visibility, and simple credit scoring can sit in one web experience.

## Stack

- PHP
- Django
- Bootstrap 5
- Vanilla JavaScript
- HTML and CSS
- Chart.js via CDN

## Project Structure

- `index.php` routes the requested page.
- `app/data.php` loads public dashboard, credit, and government bootstrap data from the Django API.
- `app/views/` contains page templates.
- `app/partials/` contains shared layout markup.
- `assets/` contains custom CSS and JavaScript.
- `backend/` contains the Django API for authentication, business registration, platform bootstrap data, and owner workspace persistence.

## Run Locally

1. Install PHP 8 or newer if it is not already available.
2. Install Python 3.14 or newer if it is not already available.
3. From the project root, start both local services with `powershell -ExecutionPolicy Bypass -File .\run-local.ps1`.
4. Open `http://127.0.0.1:8088` in your browser.

### Manual Startup

If you prefer to run each service yourself:

1. In one terminal, run the PHP frontend with `php -S 127.0.0.1:8088` from the project root.
2. In a second terminal, go to `backend/` and run:
	- `python -m pip install -r requirements.txt`
	- `python manage.py makemigrations registry`
	- `python manage.py migrate`
	- `python manage.py seed_demo_data`
	- `python manage.py runserver 127.0.0.1:8001`
3. Open `http://127.0.0.1:8088` in your browser.

### Local Notes

- The main app uses the Django SQLite database at `backend/db.sqlite3` by default.
- `run-local.ps1` starts the frontend on `127.0.0.1:8088` because port `8000` commonly conflicts with other local services.
- The startup script checks ports before launching and tells you which process is blocking them if there is a conflict.
- The Django API accepts local `localhost` and `127.0.0.1` frontend origins, so the login flow can still work when the PHP frontend is moved to another local port.

## GitHub Pages Demo

GitHub Pages cannot run the PHP frontend or the Django backend. The static build under `docs/` remains available as a legacy presentation surface, but it is no longer the authoritative deployed app.

- `docs/index.html` is the Pages entry point.
- `docs/assets/js/demo.js` only powers the small static notice interactions.
- `docs/assets/css/demo.css` styles the static notice page.
- `.github/workflows/deploy-pages.yml` deploys the `docs/` folder through GitHub Actions.

### Demo Behavior

- The Pages output is informational only and does not run the product workflow.
- It links users to the live Render deployment and shows the local startup command for the real stack.
- It does not include seeded credentials, browser-stored registrations, or a second client-side owner workspace.
- The signed ledger protection applies only to the Django-backed app, not to GitHub Pages.

### Publishing

1. Push the repo to GitHub.
2. In the repository settings, set GitHub Pages to deploy from GitHub Actions.
3. The `Deploy Pages Demo` workflow will publish the `docs/` folder.

This keeps the local PHP and Django app available for full development while leaving GitHub Pages as a clear pointer to the real deployment path.

## Render Deployment

Render deployment is now split into these services:

- The public app is a Dockerized PHP web service built from the repository root and serving `index.php`, `app/`, and `assets/`.
- `backend/` is the Django API service.

### Blueprint

This repo includes `render.yaml` so Render can create the PHP web service, Django web service, and PostgreSQL database with one blueprint deploy.

### Manual Render Values

Public app:

- Service type: `Web Service`
- Name: `ledgerlift-uganda-demo`
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
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://ledgerlift-uganda-api.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `LEDGERLIFT_ALLOWED_ORIGINS=https://ledgerlift-uganda-demo.onrender.com`
- `DATABASE_URL=<Render PostgreSQL connection string>`

If you keep the default service names from `render.yaml`, those hostnames will match Render's generated URLs.
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