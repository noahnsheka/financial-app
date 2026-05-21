# Django Backend

This backend provides a lightweight JSON API for LedgerLift Uganda.

## Current MVP Endpoints

- `GET /api/health/`
- `GET /api/businesses/`
- `POST /api/businesses/`
- `GET /api/ledger/integrity/`
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

## Tamper-Evident Ledger

- Every business registration create or update writes both a business-specific ledger block and a signed app security block in the same database transaction.
- User account creates and updates, demo access profile changes, and auth events like login failures, login success, registration, and logout are also appended to the app security chain.
- The app security chain uses SHA-256 hashing plus HMAC signing with `LEDGER_CHAIN_SECRET` so a database-only attacker cannot silently rewrite blocks without the signing secret.
- `GET /api/ledger/integrity/` returns aggregate verification status for the business ledger and the signed app security ledger for authenticated users.
- Set `LEDGER_CHAIN_SECRET` separately from `DJANGO_SECRET_KEY` in production so ledger verification is anchored to a dedicated secret.
- This is a tamper-evident foundation, not a decentralized blockchain network. If you need stronger guarantees later, the next step is anchoring ledger hashes outside the application database.