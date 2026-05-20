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
- `app/data.php` contains realistic demo data for businesses, credit signals, and government insights.
- `app/views/` contains page templates.
- `app/partials/` contains shared layout markup.
- `assets/` contains custom CSS and JavaScript.
- `backend/` contains the Django API for business registration, demo accounts, and future PostgreSQL integration.

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

GitHub Pages cannot run the PHP frontend or the Django backend. To make demos work properly on GitHub Pages, this repo now includes a static demo build under `docs/`.

- `docs/index.html` is the Pages entry point.
- `docs/assets/js/demo.js` contains seeded data, client-side routing, demo login, and browser-stored registrations.
- `docs/assets/css/demo.css` contains the standalone Pages styling.
- `.github/workflows/deploy-pages.yml` deploys the `docs/` folder through GitHub Actions.

### Demo Behavior

- Demo registrations are stored in browser local storage.
- Demo login uses the seeded showcase accounts client-side.
- Charts, registry views, credit pages, and government views all work without a server.

### Publishing

1. Push the repo to GitHub.
2. In the repository settings, set GitHub Pages to deploy from GitHub Actions.
3. The `Deploy Pages Demo` workflow will publish the `docs/` folder.

This keeps the local PHP and Django app available for full development while providing a Pages-safe demo build for stakeholders.

## App Flow

- `Businesses` now loads live registrations from the Django API instead of the original mock PHP list.
- `Login` authenticates against Django's seeded demo accounts.
- `Workspace` shows a role-based control room for government, lender, and field-agent users.

## Demo Accounts

- Government officer: `gov.officer` / `GovDemo123!`
- Lender: `lender.partner` / `LenderDemo123!`
- Field agent: `field.agent` / `FieldDemo123!`

These seeded demo accounts are designed to work even when a business does not yet have a live TIN.

## SQL Search Result

I searched the accessible Desktop, Downloads, and Documents folders for `.sql` files. The most relevant match was [pos init.sql](c:\Users\noahs\OneDrive\Desktop\Noahs projects\pos\backend\php\database\init.sql), but it defines a separate MySQL POS schema (`pos_desktop`) with products, cashiers, and orders. It does not match this fintech registry backend, so it was not imported into the Django app.

## Suggested Next Steps

1. Switch the Django database settings to PostgreSQL once the schema or SQL dump is ready.
2. Add a URA tax lookup integration that validates the TIN and hydrates owner details.
3. Connect mobile money and stock records to actual shop activity.
4. Add authentication screens and role-specific dashboards on top of the seeded demo accounts.