import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


def get_identity_provider_configs() -> list[dict[str, str]]:
    providers = []

    if settings.NIRA_API_BASE_URL:
        providers.append(
            {
                'name': 'NIRA',
                'url': settings.NIRA_API_BASE_URL,
                'api_key': settings.NIRA_API_KEY,
            }
        )

    if settings.NITA_API_BASE_URL:
        providers.append(
            {
                'name': 'NITA',
                'url': settings.NITA_API_BASE_URL,
                'api_key': settings.NITA_API_KEY,
            }
        )

    return providers


def call_identity_provider(provider: dict[str, str], payload: dict) -> dict:
    headers = {'Content-Type': 'application/json'}

    if provider.get('api_key'):
        headers['Authorization'] = f"Bearer {provider['api_key']}"

    request = Request(
        provider['url'],
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST',
    )

    try:
        with urlopen(request, timeout=settings.UGANDA_IDENTITY_API_TIMEOUT) as response:
            body = json.loads(response.read().decode('utf-8') or '{}')

        provider_status = str(body.get('status', '')).strip().lower()
        verified = bool(body.get('verified')) or provider_status in {'verified', 'matched', 'ok', 'success'}
        pending = provider_status in {'pending', 'queued', 'processing'}
        notes = str(body.get('message') or body.get('detail') or '').strip()

        return {
            'provider': provider['name'],
            'verified': verified,
            'pending': pending,
            'notes': notes or f"{provider['name']} responded with status '{provider_status or 'unknown'}'.",
        }
    except HTTPError as exc:
        return {
            'provider': provider['name'],
            'verified': False,
            'pending': False,
            'notes': f"{provider['name']} rejected the request with HTTP {exc.code}.",
        }
    except URLError as exc:
        reason = getattr(exc, 'reason', 'connection error')
        return {
            'provider': provider['name'],
            'verified': False,
            'pending': False,
            'notes': f"{provider['name']} could not be reached: {reason}.",
        }


def verify_uganda_identity(*, nin_number: str, owner_name: str, business_name: str) -> dict:
    providers = get_identity_provider_configs()

    if not providers:
        return {
            'status': 'manual_review',
            'source': 'offline_setup',
            'notes': 'NIRA and NITA verification is configured for future live use. Add provider URLs and API keys to run live checks.',
            'details': [],
        }

    request_payload = {
        'nin_number': nin_number,
        'owner_name': owner_name,
        'business_name': business_name,
    }
    details = []

    for provider in providers:
        result = call_identity_provider(provider, request_payload)
        details.append(result)

        if result['verified']:
            return {
                'status': 'verified',
                'source': provider['name'],
                'notes': result['notes'],
                'details': details,
            }

        if result['pending']:
            return {
                'status': 'pending',
                'source': provider['name'],
                'notes': result['notes'],
                'details': details,
            }

    return {
        'status': 'manual_review',
        'source': '+'.join(result['provider'] for result in details) or 'offline_setup',
        'notes': 'Identity providers did not confirm the NIN automatically. Manual review is required.',
        'details': details,
    }