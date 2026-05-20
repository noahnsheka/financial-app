# Django Backend

This backend provides a lightweight JSON API for LedgerLift Uganda.

## Current MVP Endpoints

- `GET /api/health/`
- `GET /api/businesses/`
- `POST /api/businesses/`
- `GET /api/demo-accounts/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

## Local Setup

1. From the repository root, run `powershell -ExecutionPolicy Bypass -File .\run-local.ps1` to start both the PHP frontend and this API together.
2. If you only want the API, open a terminal inside `backend/`.
3. Install dependencies with `python -m pip install -r requirements.txt`.
4. Run `python manage.py makemigrations registry`.
5. Run `python manage.py migrate`.
6. Run `python manage.py seed_demo_data`.
7. Start the API with `python manage.py runserver 127.0.0.1:8001`.

## Demo Credentials

- Government officer: `gov.officer` / `GovDemo123!`
- Lender: `lender.partner` / `LenderDemo123!`
- Field agent: `field.agent` / `FieldDemo123!`

Use these credentials on the PHP login page to open the role-based workspace. Authentication is checked against Django's real user records.

## TIN Strategy

- `tin_number` is optional in the current MVP.
- When present, the registration is marked as ready for tax lookup.
- Demo registrations bypass the TIN requirement so the product can be showcased before URA integration is added.