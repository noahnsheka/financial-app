import json
import os
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from urllib.parse import urlparse

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import transaction
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .identity_verification import verify_uganda_identity
from .models import (
    AppSecurityLedgerBlock,
    BusinessRegistration,
    BusinessRegistrationLedgerBlock,
    DemoAccessProfile,
    PlatformConfiguration,
    decimal_or_zero,
    int_or_zero,
    serialize_decimal,
)


OFFICIAL_ROLES = {
    DemoAccessProfile.Role.GOVERNMENT,
    DemoAccessProfile.Role.LENDER,
    DemoAccessProfile.Role.FIELD_AGENT,
}

BUSINESS_DECIMAL_FIELDS = {
    'inventory_value_estimate': 'Inventory value estimate',
    'average_monthly_profit': 'Average monthly profit',
    'average_monthly_mobile_money': 'Average monthly mobile money',
    'receipt_value_total': 'Receipt value total',
}

BUSINESS_INTEGER_FIELDS = {
    'receipt_count': 'Receipt count',
}


def get_allowed_origins() -> list[str]:
    configured = os.environ.get(
        'LEDGERLIFT_ALLOWED_ORIGINS',
        os.environ.get(
            'LEDGERLIFT_ALLOWED_ORIGIN',
            'http://localhost:8088,http://127.0.0.1:8088,http://localhost:8000,http://127.0.0.1:8000',
        ),
    )
    return [origin.strip() for origin in configured.split(',') if origin.strip()]


def is_local_origin(origin: str | None) -> bool:
    if not origin:
        return False

    parsed = urlparse(origin)
    return parsed.scheme in {'http', 'https'} and parsed.hostname in {'localhost', '127.0.0.1'}


def get_response_origin(request: HttpRequest | None) -> str:
    allowed_origins = get_allowed_origins()
    request_origin = request.headers.get('Origin') if request else None

    if request_origin and (request_origin in allowed_origins or is_local_origin(request_origin)):
        return request_origin

    return allowed_origins[0]


def add_cors_headers(response: HttpResponse, request: HttpRequest | None = None) -> HttpResponse:
    requested_headers = request.headers.get('Access-Control-Request-Headers') if request else None

    response['Access-Control-Allow-Origin'] = get_response_origin(request)
    response['Access-Control-Allow-Headers'] = requested_headers or 'Content-Type, X-CSRFToken'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS'
    response['Access-Control-Allow-Credentials'] = 'true'
    response['Vary'] = 'Origin'
    return response


def options_response(request: HttpRequest) -> HttpResponse:
    return add_cors_headers(HttpResponse(status=204), request)


def json_response(payload, status: int = 200, request: HttpRequest | None = None) -> JsonResponse:
    response = JsonResponse(payload, status=status, safe=not isinstance(payload, list))
    return add_cors_headers(response, request)


def parse_request_payload(request: HttpRequest) -> dict:
    if request.content_type == 'application/json':
        return json.loads(request.body.decode('utf-8') or '{}')

    return request.POST.dict()


def parse_bool(value) -> bool:
    if isinstance(value, bool):
        return value

    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def parse_non_negative_decimal(value, label: str) -> Decimal:
    raw_value = str(value or '').strip()

    if not raw_value:
        return Decimal('0')

    try:
        parsed = Decimal(raw_value)
    except InvalidOperation as exc:
        raise ValueError(f'{label} must be a numeric amount.') from exc

    if parsed < 0:
        raise ValueError(f'{label} cannot be negative.')

    return parsed.quantize(Decimal('0.01'))


def parse_non_negative_int(value, label: str) -> int:
    raw_value = str(value or '').strip()

    if not raw_value:
        return 0

    try:
        parsed = int(raw_value)
    except ValueError as exc:
        raise ValueError(f'{label} must be a whole number.') from exc

    if parsed < 0:
        raise ValueError(f'{label} cannot be negative.')

    return parsed


def extract_business_evidence_fields(payload: dict, *, include_missing: bool) -> dict:
    values = {}

    for field_name, label in BUSINESS_DECIMAL_FIELDS.items():
        if include_missing or field_name in payload:
            values[field_name] = parse_non_negative_decimal(payload.get(field_name, ''), label)

    for field_name, label in BUSINESS_INTEGER_FIELDS.items():
        if include_missing or field_name in payload:
            values[field_name] = parse_non_negative_int(payload.get(field_name, ''), label)

    return values


def build_credit_registration_reference(business: BusinessRegistration) -> str:
    return f"LLCR-{timezone.now():%Y%m%d}-{business.pk:05d}"


def get_client_ip(request: HttpRequest) -> str:
    forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()

    return request.META.get('REMOTE_ADDR', '')


def build_request_security_payload(request: HttpRequest, **extra_fields) -> dict:
    payload = {
        'client_ip': get_client_ip(request),
        'origin': request.headers.get('Origin', ''),
        'path': request.path,
        'user_agent': request.headers.get('User-Agent', ''),
    }
    payload.update(extra_fields)
    return payload


def serialize_business(business: BusinessRegistration, *, include_workspace: bool = False) -> dict:
    payload = {
        'id': business.id,
        'business_name': business.business_name,
        'owner_name': business.owner_name,
        'phone_number': business.phone_number,
        'mobile_money_number': business.mobile_money_number,
        'tin_number': business.tin_number,
        'nin_number': business.nin_number,
        'nin_verification_status': business.nin_verification_status,
        'nin_verification_status_label': business.get_nin_verification_status_display(),
        'nin_verification_source': business.nin_verification_source,
        'nin_verification_notes': business.nin_verification_notes,
        'district': business.district,
        'sector': business.sector,
        'location_description': business.location_description,
        'stock_focus': business.stock_focus,
        'monthly_revenue_band': business.monthly_revenue_band,
        'revenue_band_midpoint': serialize_decimal(business.revenue_band_midpoint),
        'inventory_value_estimate': serialize_decimal(business.inventory_value_estimate),
        'average_monthly_profit': serialize_decimal(business.average_monthly_profit),
        'average_monthly_mobile_money': serialize_decimal(business.average_monthly_mobile_money),
        'receipt_count': business.receipt_count,
        'receipt_value_total': serialize_decimal(business.receipt_value_total),
        'employee_count': business.employee_count,
        'is_demo_account': business.is_demo_account,
        'account_mode': business.account_mode,
        'tax_lookup_status': business.tax_lookup_status,
        'tax_lookup_status_label': business.get_tax_lookup_status_display(),
        'profile_score': business.profile_score,
        'profile_label': business.profile_label,
        'consistency_score': business.consistency_score,
        'receipt_trust_score': business.receipt_trust_score,
        'identity_trust_score': business.identity_trust_score,
        'credit_readiness_score': business.credit_readiness_score,
        'credit_score': business.credit_score,
        'credit_label': business.credit_label,
        'is_credit_ready': business.is_credit_ready,
        'fraud_risk_level': business.fraud_risk_level,
        'credit_registration_status': business.credit_registration_status,
        'credit_registration_status_label': business.get_credit_registration_status_display(),
        'credit_registration_reference': business.credit_registration_reference,
        'credit_registration_submitted_at': business.credit_registration_submitted_at.isoformat() if business.credit_registration_submitted_at else None,
        'credit_signal_gaps': business.credit_signal_gaps,
        'credit_registration_prompt': business.is_credit_ready and business.credit_registration_status in {
            BusinessRegistration.CreditRegistrationStatus.NOT_STARTED,
            BusinessRegistration.CreditRegistrationStatus.ELIGIBLE,
        },
        'notes': business.notes,
        'account_username': business.account_user.get_username() if business.account_user_id else '',
        'created_at': business.created_at.isoformat(),
        'updated_at': business.updated_at.isoformat(),
    }

    if include_workspace:
        payload['workspace'] = business.normalized_workspace_payload

    return payload


def get_demo_profile(user):
    try:
        return user.demo_profile
    except DemoAccessProfile.DoesNotExist:
        return None


def get_user_role(user) -> str:
    profile = get_demo_profile(user)
    return profile.role if profile else DemoAccessProfile.Role.FIELD_AGENT


def is_official_role(role: str) -> bool:
    return role in OFFICIAL_ROLES


def get_owned_business(user):
    try:
        return user.owned_business
    except BusinessRegistration.DoesNotExist:
        return None


def serialize_session_user(user) -> dict:
    profile = get_demo_profile(user)
    role = get_user_role(user)
    role_label = profile.get_role_display() if profile else 'Field agent'
    owned_business = get_owned_business(user)
    recommended_page = {
        DemoAccessProfile.Role.GOVERNMENT: 'government',
        DemoAccessProfile.Role.LENDER: 'credit',
        DemoAccessProfile.Role.FIELD_AGENT: 'registration',
        DemoAccessProfile.Role.BUSINESS_OWNER: 'workspace',
    }.get(role, 'dashboard')

    return {
        'username': user.username,
        'display_name': profile.display_name if profile else user.get_username(),
        'role': role,
        'role_label': role_label,
        'is_official': is_official_role(role),
        'requires_tin': profile.requires_tin if profile else False,
        'notes': profile.notes if profile else '',
        'recommended_page': recommended_page,
        'business': serialize_business(owned_business) if owned_business else None,
    }


def format_compact_currency_label(value) -> str:
    amount = decimal_or_zero(value)

    if amount >= Decimal('1000000'):
        millions = float(amount / Decimal('1000000'))
        label = f'UGX {millions:.1f}M'
        return label.replace('.0M', 'M')

    if amount >= Decimal('1000'):
        thousands = float(amount / Decimal('1000'))
        label = f'UGX {thousands:.0f}k'
        return label

    return f'UGX {int(amount)}'


def format_percentage_label(numerator: int, denominator: int) -> str:
    if denominator <= 0:
        return '0%'

    return f"{round((numerator / denominator) * 100)}%"


def parse_workspace_date(value, label: str) -> date:
    raw_value = str(value or '').strip()

    if not raw_value:
        raise ValueError(f'{label} is required.')

    try:
        return date.fromisoformat(raw_value)
    except ValueError as exc:
        raise ValueError(f'{label} must be a valid date.') from exc


def build_workspace_entry_id(prefix: str) -> str:
    return f'{prefix}-{timezone.now():%Y%m%d%H%M%S%f}'


def latest_workspace_stock_entries(stock_entries: list[dict]) -> list[dict]:
    latest_by_item = {}

    for entry in sorted(stock_entries, key=lambda item: str(item.get('date', '')), reverse=True):
        item_key = str(entry.get('item_name', '')).strip().lower()

        if not item_key or item_key in latest_by_item:
            continue

        latest_by_item[item_key] = entry

    return list(latest_by_item.values())


def get_business_access_context(request: HttpRequest, business: BusinessRegistration) -> tuple[str, bool]:
    user_role = get_user_role(request.user)
    owned_business = get_owned_business(request.user)
    can_manage_business = (
        user_role == DemoAccessProfile.Role.BUSINESS_OWNER
        and owned_business is not None
        and owned_business.pk == business.pk
    )
    return user_role, can_manage_business


def summarize_business_stock_alerts(business: BusinessRegistration) -> list[dict]:
    alerts = []

    for entry in latest_workspace_stock_entries(business.normalized_workspace_payload['stock_entries']):
        on_hand = int_or_zero(entry.get('on_hand'))
        reorder_level = max(1, int_or_zero(entry.get('reorder_level')))
        sold = int_or_zero(entry.get('sold'))

        if on_hand > reorder_level:
            continue

        estimated_days = max(1, round(on_hand / max(sold, 1)))
        severity = 'Critical' if on_hand <= max(1, round(reorder_level * 0.5)) else 'High'

        alerts.append(
            {
                'business': business.business_name,
                'district': business.district,
                'category': entry.get('item_name') or business.sector,
                'days': f'{estimated_days} day{"s" if estimated_days != 1 else ""} left',
                'severity': severity,
            }
        )

    return alerts


def build_platform_bootstrap_payload() -> dict:
    config, _ = PlatformConfiguration.objects.get_or_create(singleton_id=1)
    businesses = list(BusinessRegistration.objects.select_related('account_user').all())
    business_count = len(businesses)
    unique_districts = sorted({business.district for business in businesses if business.district})
    credit_ready_count = sum(1 for business in businesses if business.is_credit_ready)
    mobile_money_enabled_count = sum(1 for business in businesses if business.mobile_money_number)
    average_credit_score = round(
        sum(business.credit_score for business in businesses) / business_count,
    ) if business_count else 0

    monthly_rollups = {}
    sector_counts = {}
    stock_alerts = []
    receipt_gap_count = 0
    missing_tin_count = 0

    for business in businesses:
        if business.receipt_count < 5:
            receipt_gap_count += 1

        if not business.tin_number:
            missing_tin_count += 1

        sector_key = business.sector or 'Unspecified'
        sector_counts[sector_key] = sector_counts.get(sector_key, 0) + 1
        stock_alerts.extend(summarize_business_stock_alerts(business))

        for entry in business.normalized_workspace_payload['monthly_sales']:
            month_start = str(entry.get('month_start', '')).strip()

            if not month_start:
                continue

            if month_start not in monthly_rollups:
                monthly_rollups[month_start] = {
                    'cash_sales': Decimal('0'),
                    'label': str(entry.get('label', '')).strip() or month_start,
                    'mobile_money': Decimal('0'),
                    'readiness_scores': [],
                    'supplier_payments': Decimal('0'),
                }

            monthly_rollups[month_start]['mobile_money'] += decimal_or_zero(entry.get('mobile_money'))
            monthly_rollups[month_start]['cash_sales'] += decimal_or_zero(entry.get('cash_sales'))
            monthly_rollups[month_start]['supplier_payments'] += decimal_or_zero(entry.get('supplier_payments'))
            monthly_rollups[month_start]['readiness_scores'].append(
                int_or_zero(entry.get('readiness_score')) or business.credit_score,
            )

    ordered_months = sorted(monthly_rollups.keys())[-6:]
    collections = {
        'labels': [monthly_rollups[month]['label'] for month in ordered_months],
        'mobileMoney': [round(float(monthly_rollups[month]['mobile_money'] / Decimal('1000000')), 1) for month in ordered_months],
        'cash': [round(float(monthly_rollups[month]['cash_sales'] / Decimal('1000000')), 1) for month in ordered_months],
        'supplierPayments': [round(float(monthly_rollups[month]['supplier_payments'] / Decimal('1000000')), 1) for month in ordered_months],
    }
    score_trend = {
        'labels': [monthly_rollups[month]['label'] for month in ordered_months],
        'values': [
            round(sum(monthly_rollups[month]['readiness_scores']) / len(monthly_rollups[month]['readiness_scores']))
            if monthly_rollups[month]['readiness_scores'] else 0
            for month in ordered_months
        ],
    }

    inventory_mix_labels = sorted(sector_counts, key=sector_counts.get, reverse=True)[:4]
    inventory_mix = {
        'labels': inventory_mix_labels,
        'values': [sector_counts[label] for label in inventory_mix_labels],
    }

    district_performance_rows = []
    for district in unique_districts:
        district_businesses = [business for business in businesses if business.district == district]
        district_performance_rows.append(
            {
                'district': district,
                'avg_score': round(
                    sum(business.credit_score for business in district_businesses) / len(district_businesses),
                ) if district_businesses else 0,
                'count': len(district_businesses),
            }
        )

    district_performance_rows.sort(key=lambda item: item['avg_score'], reverse=True)
    district_performance = {
        'labels': [row['district'] for row in district_performance_rows[:5]],
        'scores': [row['avg_score'] for row in district_performance_rows[:5]],
    }

    watchlist = [
        {
            'title': 'Active stock pressure in live businesses',
            'detail': f'{len(stock_alerts)} stock alerts are currently below reorder level across the registry.',
        },
        {
            'title': 'Receipt evidence still missing in part of the portfolio',
            'detail': f'{receipt_gap_count} businesses still have fewer than five receipts recorded in the database.',
        },
        {
            'title': 'Formalization still depends on TIN capture',
            'detail': f'{missing_tin_count} businesses do not yet have a TIN on file for tax-readiness checks.',
        },
    ]
    interventions = [
        {
            'title': 'Resolve low-stock businesses first',
            'detail': f'Prioritize support for the {len(stock_alerts)} businesses already at or below the reorder threshold.',
        },
        {
            'title': 'Improve receipt discipline',
            'detail': f'Focus bookkeeping support on the {receipt_gap_count} businesses with weak receipt evidence.',
        },
        {
            'title': 'Close TIN coverage gaps',
            'detail': f'Push compliance outreach for the {missing_tin_count} businesses missing tax identifiers.',
        },
    ]

    return {
        'registrationForm': {
            'districts': config.registration_form.get('districts', []),
            'sectors': config.registration_form.get('sectors', []),
            'revenueBands': config.registration_form.get('revenueBands', []),
        },
        'scoreBreakdown': config.score_breakdown,
        'loanPrograms': config.loan_programs,
        'heroStats': [
            {'label': 'Districts in pilot', 'value': str(len(unique_districts))},
            {'label': 'Daily mobile money sync', 'value': format_percentage_label(mobile_money_enabled_count, business_count)},
            {'label': 'Loan-ready shops', 'value': format_percentage_label(credit_ready_count, business_count)},
            {'label': 'Stock alerts open', 'value': str(len(stock_alerts))},
        ],
        'metrics': [
            {
                'label': 'Tracked businesses',
                'value': str(business_count),
                'delta': f'{credit_ready_count} credit ready',
                'icon': 'shop-window',
                'tone': 'forest',
            },
            {
                'label': 'Mobile money volume',
                'value': format_compact_currency_label(sum(monthly_rollups[month]['mobile_money'] for month in ordered_months)),
                'delta': f'{mobile_money_enabled_count} businesses synced',
                'icon': 'phone',
                'tone': 'amber',
            },
            {
                'label': 'Average pilot score',
                'value': f'{average_credit_score} / 100',
                'delta': f'{receipt_gap_count} with receipt gaps',
                'icon': 'bar-chart-line',
                'tone': 'sage',
            },
            {
                'label': 'Inventory risk',
                'value': f'{len(stock_alerts)} alerts',
                'delta': f'{missing_tin_count} missing TIN',
                'icon': 'boxes',
                'tone': 'clay',
            },
        ],
        'collections': collections,
        'inventoryMix': inventory_mix,
        'scoreTrend': score_trend,
        'districtPerformance': district_performance,
        'stockAlerts': stock_alerts[:8],
        'watchlist': watchlist,
        'interventions': interventions,
    }


def health_check(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    return json_response(
        {
            'status': 'ok',
            'service': 'ledgerlift-backend',
            'database': 'postgres' if os.environ.get('POSTGRES_DB') or os.environ.get('PGDATABASE') else 'sqlite',
        }
        ,
        request=request,
    )


def ledger_integrity(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    if request.method != 'GET':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    business_verification = BusinessRegistrationLedgerBlock.verify_chain()
    app_security_verification = AppSecurityLedgerBlock.verify_chain()
    overall_valid = business_verification['is_valid'] and app_security_verification['is_valid']
    status = 200 if overall_valid else 409
    return json_response(
        {
            'is_valid': overall_valid,
            'ledger': business_verification,
            'ledgers': {
                'business_registrations': business_verification,
                'app_security': app_security_verification,
            },
            'protection_model': 'tamper-evident hash chains with HMAC signing',
        },
        status=status,
        request=request,
    )


def service_root(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'GET':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    return json_response(
        {
            'service': 'ledgerlift-backend',
            'status': 'ok',
            'message': 'LedgerLift backend is running.',
            'health': '/api/health/',
            'endpoints': [
                '/api/health/',
                '/api/demo-accounts/',
                '/api/auth/login/',
                '/api/auth/register/',
                '/api/auth/logout/',
                '/api/auth/me/',
                '/api/platform/bootstrap/',
                '/api/businesses/',
                '/api/businesses/<id>/',
                '/api/businesses/<id>/stock-entries/',
                '/api/businesses/<id>/documents/',
                '/api/businesses/<id>/credit-draft/',
                '/api/businesses/<id>/credit-registration/',
                '/api/ledger/integrity/',
            ],
        },
        request=request,
    )


def platform_bootstrap(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'GET':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    return json_response(build_platform_bootstrap_payload(), request=request)


@csrf_exempt
def business_collection(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    user_role = get_user_role(request.user)

    if request.method == 'GET':
        if user_role == DemoAccessProfile.Role.BUSINESS_OWNER:
            owned_business = get_owned_business(request.user)
            businesses = [serialize_business(owned_business, include_workspace=True)] if owned_business else []
            return json_response({'count': len(businesses), 'results': businesses, 'scope': 'owned'}, request=request)

        businesses = [serialize_business(business) for business in BusinessRegistration.objects.select_related('account_user').all()[:25]]
        return json_response({'count': len(businesses), 'results': businesses, 'scope': 'official'}, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    if user_role == DemoAccessProfile.Role.BUSINESS_OWNER and get_owned_business(request.user) is not None:
        return json_response(
            {'error': 'Business owner accounts can only manage the assigned business profile.'},
            status=403,
            request=request,
        )

    required_fields = {
        'business_name': 'Business name',
        'phone_number': 'Phone number',
        'district': 'District',
        'sector': 'Business sector',
    }

    if user_role != DemoAccessProfile.Role.BUSINESS_OWNER:
        required_fields['owner_name'] = 'Owner name'

    missing = [label for field, label in required_fields.items() if not str(payload.get(field, '')).strip()]
    if missing:
        return json_response({'error': 'Missing required fields.', 'fields': missing}, status=400, request=request)

    employee_count_raw = str(payload.get('employee_count', '1')).strip() or '1'

    try:
        employee_count = max(1, int(employee_count_raw))
    except ValueError:
        return json_response({'error': 'Employee count must be a whole number.'}, status=400, request=request)

    try:
        evidence_fields = extract_business_evidence_fields(payload, include_missing=True)
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    business = BusinessRegistration(
        business_name=str(payload.get('business_name', '')).strip(),
        owner_name=str(payload.get('owner_name', '')).strip() or serialize_session_user(request.user)['display_name'],
        phone_number=str(payload.get('phone_number', '')).strip(),
        mobile_money_number=str(payload.get('mobile_money_number', '')).strip(),
        tin_number=str(payload.get('tin_number', '')).strip(),
        district=str(payload.get('district', '')).strip(),
        sector=str(payload.get('sector', '')).strip(),
        location_description=str(payload.get('location_description', '')).strip(),
        stock_focus=str(payload.get('stock_focus', '')).strip(),
        monthly_revenue_band=str(payload.get('monthly_revenue_band', '')).strip(),
        employee_count=employee_count,
        is_demo_account=parse_bool(payload.get('is_demo_account', False)),
        notes=str(payload.get('notes', '')).strip(),
        account_user=request.user if user_role == DemoAccessProfile.Role.BUSINESS_OWNER else None,
        **evidence_fields,
    )

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Business registration saved.',
            'business': serialize_business(business),
        },
        status=201,
        request=request,
    )


@csrf_exempt
def business_detail(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()
    if business is None:
        return json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role, can_manage_business = get_business_access_context(request, business)

    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this business profile.'}, status=403, request=request)

    if request.method == 'GET':
        return json_response({'business': serialize_business(business, include_workspace=can_manage_business)}, request=request)

    if request.method != 'PATCH':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can adjust this profile.'}, status=403, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    editable_fields = {
        'business_name',
        'phone_number',
        'mobile_money_number',
        'tin_number',
        'district',
        'sector',
        'location_description',
        'stock_focus',
        'monthly_revenue_band',
        'notes',
    }

    for field_name in editable_fields:
        if field_name in payload:
            setattr(business, field_name, str(payload.get(field_name, '')).strip())

    if 'employee_count' in payload:
        employee_count_raw = str(payload.get('employee_count', '')).strip() or '1'

        try:
            business.employee_count = max(1, int(employee_count_raw))
        except ValueError:
            return json_response({'error': 'Employee count must be a whole number.'}, status=400, request=request)

    try:
        for field_name, value in extract_business_evidence_fields(payload, include_missing=False).items():
            setattr(business, field_name, value)
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Business profile updated.',
            'business': serialize_business(business),
        },
        request=request,
    )


@csrf_exempt
def credit_registration(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()
    if business is None:
        return json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role, can_manage_business = get_business_access_context(request, business)

    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this credit registration.'}, status=403, request=request)

    if request.method == 'GET':
        return json_response({'business': serialize_business(business)}, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    if not business.is_credit_ready:
        return json_response(
            {'error': 'This business is not ready for NIN-backed credit registration yet.'},
            status=400,
            request=request,
        )

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    nin_number = str(payload.get('nin_number', '')).strip().upper()

    if not nin_number:
        return json_response({'error': 'A Uganda NIN is required for credit registration.'}, status=400, request=request)

    if len(nin_number) != 14 or not nin_number.isalnum():
        return json_response({'error': 'NIN must be a 14-character alphanumeric national ID number.'}, status=400, request=request)

    verification = verify_uganda_identity(
        nin_number=nin_number,
        owner_name=business.owner_name,
        business_name=business.business_name,
    )

    business.nin_number = nin_number
    business.nin_verification_status = {
        'verified': BusinessRegistration.NINVerificationStatus.VERIFIED,
        'pending': BusinessRegistration.NINVerificationStatus.PENDING,
        'manual_review': BusinessRegistration.NINVerificationStatus.MANUAL_REVIEW,
    }.get(verification['status'], BusinessRegistration.NINVerificationStatus.MANUAL_REVIEW)
    business.nin_verification_source = verification['source']
    business.nin_verification_notes = verification['notes']
    business.credit_registration_reference = business.credit_registration_reference or build_credit_registration_reference(business)
    business.credit_registration_submitted_at = timezone.now()
    business.credit_registration_status = (
        BusinessRegistration.CreditRegistrationStatus.VERIFIED
        if verification['status'] == 'verified'
        else BusinessRegistration.CreditRegistrationStatus.SUBMITTED
    )

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Credit registration submitted.',
            'business': serialize_business(business, include_workspace=can_manage_business),
            'verification': verification,
        },
        request=request,
    )


@csrf_exempt
def business_stock_entries(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()
    if business is None:
        return json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role, can_manage_business = get_business_access_context(request, business)
    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this business workspace.'}, status=403, request=request)

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can add stock entries.'}, status=403, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    item_name = str(payload.get('item_name', '')).strip()
    if not item_name:
        return json_response({'error': 'Stock item name is required.'}, status=400, request=request)

    try:
        entry_date = parse_workspace_date(payload.get('date'), 'Entry date')
        on_hand = parse_non_negative_int(payload.get('on_hand', 0), 'Current stock on hand')
        received = parse_non_negative_int(payload.get('received', 0), 'Units received')
        sold = parse_non_negative_int(payload.get('sold', 0), 'Units sold')
        reorder_level = parse_non_negative_int(payload.get('reorder_level', 0), 'Reorder level')
        selling_price = parse_non_negative_decimal(payload.get('selling_price', 0), 'Selling price')
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    workspace_payload = business.normalized_workspace_payload
    stock_entries = [
        {
            'id': build_workspace_entry_id('stock'),
            'date': entry_date.isoformat(),
            'item_name': item_name,
            'category': str(payload.get('category', '')).strip() or business.sector,
            'unit': str(payload.get('unit', '')).strip() or 'units',
            'on_hand': on_hand,
            'received': received,
            'sold': sold,
            'reorder_level': reorder_level,
            'selling_price': serialize_decimal(selling_price),
        },
        *workspace_payload['stock_entries'],
    ][:40]

    month_start = entry_date.replace(day=1)
    month_key = month_start.isoformat()
    monthly_sales = list(workspace_payload['monthly_sales'])
    existing_month = next((entry for entry in monthly_sales if entry.get('month_start') == month_key), None)
    revenue_delta = selling_price * Decimal(sold)
    mobile_money_delta = (revenue_delta * Decimal('0.65')).quantize(Decimal('0.01'))
    cash_delta = revenue_delta - mobile_money_delta
    supplier_payments_delta = (selling_price * Decimal(received) * Decimal('0.55')).quantize(Decimal('0.01'))

    if existing_month is None:
        monthly_sales.append(
            {
                'id': build_workspace_entry_id('month'),
                'month_start': month_key,
                'label': month_start.strftime('%b'),
                'revenue': serialize_decimal(revenue_delta),
                'expenses': serialize_decimal(supplier_payments_delta),
                'orders': sold,
                'mobile_money': serialize_decimal(mobile_money_delta),
                'cash_sales': serialize_decimal(cash_delta),
                'supplier_payments': serialize_decimal(supplier_payments_delta),
                'readiness_score': business.credit_score,
            }
        )
    else:
        existing_month['revenue'] = serialize_decimal(decimal_or_zero(existing_month.get('revenue')) + revenue_delta)
        existing_month['expenses'] = serialize_decimal(decimal_or_zero(existing_month.get('expenses')) + supplier_payments_delta)
        existing_month['orders'] = int_or_zero(existing_month.get('orders')) + sold
        existing_month['mobile_money'] = serialize_decimal(decimal_or_zero(existing_month.get('mobile_money')) + mobile_money_delta)
        existing_month['cash_sales'] = serialize_decimal(decimal_or_zero(existing_month.get('cash_sales')) + cash_delta)
        existing_month['supplier_payments'] = serialize_decimal(decimal_or_zero(existing_month.get('supplier_payments')) + supplier_payments_delta)
        existing_month['readiness_score'] = business.credit_score

    monthly_sales.sort(key=lambda entry: str(entry.get('month_start', '')))
    workspace_payload['stock_entries'] = stock_entries
    workspace_payload['monthly_sales'] = monthly_sales[-12:]
    business.workspace_payload = workspace_payload

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Stock entry saved.',
            'business': serialize_business(business, include_workspace=True),
        },
        request=request,
    )


@csrf_exempt
def business_documents(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()
    if business is None:
        return json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role, can_manage_business = get_business_access_context(request, business)
    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this business workspace.'}, status=403, request=request)

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can add documents.'}, status=403, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    name = str(payload.get('name', '')).strip()
    if not name:
        return json_response({'error': 'Document name is required.'}, status=400, request=request)

    due_date = str(payload.get('due_date', '')).strip()
    if due_date:
        try:
            parse_workspace_date(due_date, 'Document due date')
        except ValueError as exc:
            return json_response({'error': str(exc)}, status=400, request=request)

    workspace_payload = business.normalized_workspace_payload
    workspace_payload['documents'] = [
        {
            'id': build_workspace_entry_id('document'),
            'name': name,
            'type': str(payload.get('type', '')).strip(),
            'reference': str(payload.get('reference', '')).strip(),
            'due_date': due_date,
            'status': str(payload.get('status', '')).strip() or 'Pending',
        },
        *workspace_payload['documents'],
    ][:20]
    business.workspace_payload = workspace_payload

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Document saved.',
            'business': serialize_business(business, include_workspace=True),
        },
        request=request,
    )


@csrf_exempt
def business_credit_draft(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    if request.method != 'PATCH':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()
    if business is None:
        return json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role, can_manage_business = get_business_access_context(request, business)
    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this business workspace.'}, status=403, request=request)

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can update the credit draft.'}, status=403, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    try:
        requested_amount = parse_non_negative_decimal(payload.get('requested_amount', 0), 'Requested amount')
        bookkeeping_score = min(parse_non_negative_int(payload.get('bookkeeping_score', 0), 'Bookkeeping score'), 100)
        supplier_score = min(parse_non_negative_int(payload.get('supplier_score', 0), 'Supplier confidence'), 100)
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    workspace_payload = business.normalized_workspace_payload
    workspace_payload['credit_draft'] = {
        'requested_amount': serialize_decimal(requested_amount),
        'loan_purpose': str(payload.get('loan_purpose', '')).strip(),
        'repayment_window': str(payload.get('repayment_window', '')).strip(),
        'bookkeeping_score': bookkeeping_score,
        'supplier_score': supplier_score,
        'collateral_notes': str(payload.get('collateral_notes', '')).strip(),
        'registration_status': 'Database-backed draft',
        'updated_at': timezone.now().isoformat(),
    }
    business.workspace_payload = workspace_payload

    try:
        business.save(ledger_actor=request.user.get_username())
    except Exception as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    return json_response(
        {
            'message': 'Credit draft updated.',
            'business': serialize_business(business, include_workspace=True),
        },
        request=request,
    )


def demo_accounts(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    accounts = [
        {
            'username': profile.user.username,
            'display_name': profile.display_name,
            'role': profile.role,
            'requires_tin': profile.requires_tin,
            'notes': profile.notes,
        }
        for profile in DemoAccessProfile.objects.select_related('user').all().order_by('role', 'display_name')
    ]

    return json_response({'count': len(accounts), 'results': accounts}, request=request)


@csrf_exempt
def login_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))

    if not username or not password:
        AppSecurityLedgerBlock.append_event(
            domain=AppSecurityLedgerBlock.Domain.AUTH,
            event_type='login_rejected',
            entity_key=f'auth_attempt:{username.lower() or "anonymous"}',
            actor_identifier=username,
            payload=build_request_security_payload(
                request,
                reason='missing_credentials',
                username=username,
            ),
        )
        return json_response({'error': 'Username and password are required.'}, status=400, request=request)

    user = authenticate(request, username=username, password=password)
    if user is None:
        AppSecurityLedgerBlock.append_event(
            domain=AppSecurityLedgerBlock.Domain.AUTH,
            event_type='login_failure',
            entity_key=f'auth_attempt:{username.lower() or "anonymous"}',
            actor_identifier=username,
            payload=build_request_security_payload(
                request,
                reason='invalid_credentials',
                username=username,
            ),
        )
        return json_response({'error': 'Invalid username or password.'}, status=401, request=request)

    login(request, user)
    request.session.cycle_key()
    AppSecurityLedgerBlock.append_event(
        domain=AppSecurityLedgerBlock.Domain.AUTH,
        event_type='login_success',
        entity_key=f'user_account:{user.pk}',
        actor_identifier=user.get_username(),
        payload=build_request_security_payload(
            request,
            username=user.get_username(),
        ),
    )

    return json_response(
        {
            'message': 'Login successful.',
            'user': serialize_session_user(user),
        },
        request=request,
    )


@csrf_exempt
def register_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    display_name = str(payload.get('display_name', '')).strip()
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))
    confirm_password = str(payload.get('confirm_password', ''))
    business_name = str(payload.get('business_name', '')).strip()
    phone_number = str(payload.get('phone_number', '')).strip()
    mobile_money_number = str(payload.get('mobile_money_number', '')).strip()
    tin_number = str(payload.get('tin_number', '')).strip()
    district = str(payload.get('district', '')).strip()
    sector = str(payload.get('sector', '')).strip()
    location_description = str(payload.get('location_description', '')).strip()
    stock_focus = str(payload.get('stock_focus', '')).strip()
    monthly_revenue_band = str(payload.get('monthly_revenue_band', '')).strip()
    notes = str(payload.get('notes', '')).strip()
    employee_count_raw = str(payload.get('employee_count', '1')).strip() or '1'

    if not display_name or not username or not password or not confirm_password:
        return json_response({'error': 'Display name, username, password, and confirmation are required.'}, status=400, request=request)

    if not business_name or not phone_number or not district or not sector:
        return json_response(
            {'error': 'Business name, phone number, district, and business sector are required for owner access.'},
            status=400,
            request=request,
        )

    if len(display_name) < 3:
        return json_response({'error': 'Display name must be at least 3 characters long.'}, status=400, request=request)

    if len(username) < 3:
        return json_response({'error': 'Username must be at least 3 characters long.'}, status=400, request=request)

    if len(password) < 8:
        return json_response({'error': 'Password must be at least 8 characters long.'}, status=400, request=request)

    if password != confirm_password:
        return json_response({'error': 'Password confirmation does not match.'}, status=400, request=request)

    try:
        employee_count = max(1, int(employee_count_raw))
    except ValueError:
        return json_response({'error': 'Employee count must be a whole number.'}, status=400, request=request)

    try:
        evidence_fields = extract_business_evidence_fields(payload, include_missing=True)
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    user_model = get_user_model()
    if user_model.objects.filter(username__iexact=username).exists():
        return json_response({'error': 'That username is already in use.'}, status=400, request=request)

    with transaction.atomic():
        user = user_model.objects.create_user(username=username, password=password)
        profile = DemoAccessProfile(
            user=user,
            display_name=display_name,
            role=DemoAccessProfile.Role.BUSINESS_OWNER,
            requires_tin=False,
            notes='Self-registered business owner account.',
        )
        profile.save(ledger_actor=username)
        business = BusinessRegistration(
            business_name=business_name,
            owner_name=display_name,
            phone_number=phone_number,
            mobile_money_number=mobile_money_number,
            tin_number=tin_number,
            district=district,
            sector=sector,
            location_description=location_description,
            stock_focus=stock_focus,
            monthly_revenue_band=monthly_revenue_band,
            employee_count=employee_count,
            is_demo_account=False,
            notes=notes,
            account_user=user,
            **evidence_fields,
        )
        business.save(ledger_actor=username)

    login(request, user)
    request.session.cycle_key()
    AppSecurityLedgerBlock.append_event(
        domain=AppSecurityLedgerBlock.Domain.AUTH,
        event_type='register_success',
        entity_key=f'user_account:{user.pk}',
        actor_identifier=user.get_username(),
        payload=build_request_security_payload(
            request,
            username=user.get_username(),
        ),
    )

    return json_response(
        {
            'message': 'Account created successfully.',
            'user': serialize_session_user(user),
        },
        status=201,
        request=request,
    )


@csrf_exempt
def logout_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    if request.user.is_authenticated:
        AppSecurityLedgerBlock.append_event(
            domain=AppSecurityLedgerBlock.Domain.AUTH,
            event_type='logout',
            entity_key=f'user_account:{request.user.pk}',
            actor_identifier=request.user.get_username(),
            payload=build_request_security_payload(
                request,
                username=request.user.get_username(),
            ),
        )

    logout(request)
    return json_response({'message': 'Logged out.'}, request=request)


def me_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.user.is_authenticated:
        return json_response({'user': serialize_session_user(request.user)}, request=request)

    return json_response({'user': None}, request=request)