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
## GitHub Pages Redirect

The live public host is `https://financial-app.onrender.com`.

- `docs/index.html` now redirects directly to the live Render host instead of rendering a static database snapshot.
- `.github/workflows/deploy-pages.yml` still publishes the `docs/` folder through GitHub Actions, but that Pages site now acts only as a handoff to the live app.

### Publishing

1. Push the repo to GitHub.
2. In the repository settings, set GitHub Pages to deploy from GitHub Actions.
3. The Pages workflow will publish the redirect page from `docs/`.

## Render Deployment

Render deployment now runs as one Dockerized web service on the public host, with PHP serving `/`, Django serving `/api`, and a local reverse proxy routing both within the same container.

### Blueprint

This repo includes `render.yaml` so Render can create the unified web service and PostgreSQL database with one blueprint deploy.

### Manual Render Values

- Service type: `Web Service`
- Name: `financial-app`
- Environment: `Docker`
- Dockerfile Path: `./Dockerfile`
- Health Check Path: `/api/health/`

Render environment variables:

- `DJANGO_DEBUG=0`
- `DJANGO_SECRET_KEY=<generate a long random value>`
- `LEDGER_CHAIN_SECRET=<generate a second long random value reserved for ledger signing>`
- `LEDGER_CHAIN_KEY_ID=render-primary`
- `LEDGERLIFT_API_BASE_URL=/api`
- `LEDGERLIFT_INTERNAL_API_BASE_URL=http://127.0.0.1:8001/api`
- `NIRA_API_BASE_URL=<agency-issued NIRA verification endpoint>`
- `NIRA_API_KEY=<agency-issued NIRA API key>`
- `NITA_API_BASE_URL=<agency-issued NITA verification endpoint>`
- `NITA_API_KEY=<agency-issued NITA API key>`
- `UGANDA_IDENTITY_API_TIMEOUT=8`
- `DJANGO_ALLOWED_HOSTS=financial-app.onrender.com,127.0.0.1,localhost`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `LEDGERLIFT_ALLOWED_ORIGINS=https://financial-app.onrender.com,https://ledgerlift-uganda-demo.onrender.com`
- `DATABASE_URL=<Render PostgreSQL connection string>`

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