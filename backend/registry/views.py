import json
import os
from collections import Counter
from datetime import date
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
    clamp_score,
    DemoAccessProfile,
    PlatformConfiguration,
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


def decimal_to_float(value) -> float:
    try:
        return float(Decimal(str(value or '0')))
    except (InvalidOperation, TypeError, ValueError):
        return 0.0


def shift_month(year: int, month: int, offset: int) -> tuple[int, int]:
    absolute_month = (year * 12) + (month - 1) + offset
    return absolute_month // 12, (absolute_month % 12) + 1


def build_trailing_month_frames(count: int = 6) -> list[dict]:
    today = timezone.localdate()
    frames = []

    for offset in range(-(count - 1), 1):
        frame_year, frame_month = shift_month(today.year, today.month, offset)
        frame_date = date(frame_year, frame_month, 1)
        frames.append(
            {
                'key': frame_date.strftime('%Y-%m'),
                'label': frame_date.strftime('%b'),
            }
        )

    return frames


def parse_workspace_month_key(entry: dict) -> str | None:
    month_start = str(entry.get('month_start', '')).strip()

    if not month_start:
        return None

    try:
        parsed = date.fromisoformat(month_start[:10])
    except ValueError:
        return None

    return parsed.replace(day=1).strftime('%Y-%m')


def build_workspace_month_label(month_key: str) -> str:
    try:
        parsed = date.fromisoformat(f'{month_key}-01')
    except ValueError:
        return month_key

    return parsed.strftime('%b')


def format_compact_ugx(value: float) -> str:
    rounded = round(max(0.0, value))

    if rounded >= 1_000_000:
        millions = rounded / 1_000_000
        if millions.is_integer():
            return f'UGX {int(millions)}M'
        return f'UGX {millions:.1f}M'

    if rounded >= 1_000:
        thousands = rounded / 1_000
        if thousands.is_integer():
            return f'UGX {int(thousands)}k'
        return f'UGX {thousands:.1f}k'

    return f'UGX {int(rounded)}'


def build_platform_collections(businesses: list[BusinessRegistration]) -> tuple[dict, dict]:
    frames = build_trailing_month_frames()
    has_workspace_months = False
    buckets = {
        frame['key']: {
            'label': frame['label'],
            'mobileMoney': 0.0,
            'revenue': 0.0,
            'expenses': 0.0,
            'scoreTotal': 0.0,
            'scoreCount': 0,
        }
        for frame in frames
    }

    for business in businesses:
        workspace = business.normalized_workspace_payload
        monthly_sales = workspace.get('monthly_sales') or []
        matched_workspace_month = False

        for entry in monthly_sales:
            month_key = parse_workspace_month_key(entry)

            if not month_key or month_key not in buckets:
                continue

            bucket = buckets[month_key]
            has_workspace_months = True
            bucket['mobileMoney'] += decimal_to_float(entry.get('mobile_money'))
            bucket['revenue'] += decimal_to_float(entry.get('revenue'))
            bucket['expenses'] += decimal_to_float(entry.get('expenses'))
            bucket['scoreTotal'] += decimal_to_float(entry.get('readiness_score'))
            bucket['scoreCount'] += 1
            matched_workspace_month = True

        if matched_workspace_month:
            continue

        fallback_key = business.updated_at.strftime('%Y-%m')

        if fallback_key not in buckets:
            continue

        revenue = decimal_to_float(business.revenue_band_midpoint)

        if revenue <= 0:
            revenue = max(
                decimal_to_float(business.average_monthly_mobile_money) + decimal_to_float(business.average_monthly_profit),
                decimal_to_float(business.receipt_value_total),
            )

        expenses = max(revenue - decimal_to_float(business.average_monthly_profit), 0.0)
        bucket = buckets[fallback_key]
        bucket['mobileMoney'] += decimal_to_float(business.average_monthly_mobile_money)
        bucket['revenue'] += revenue
        bucket['expenses'] += expenses
        bucket['scoreTotal'] += float(business.credit_score or 0)
        bucket['scoreCount'] += 1

    visible_frames = frames

    if has_workspace_months:
        visible_frames = [
            frame
            for frame in frames
            if any(
                [
                    buckets[frame['key']]['mobileMoney'],
                    buckets[frame['key']]['revenue'],
                    buckets[frame['key']]['expenses'],
                    buckets[frame['key']]['scoreCount'],
                ]
            )
        ]

        if not visible_frames:
            visible_frames = frames

    collections = {
        'labels': [frame['label'] for frame in visible_frames],
        'mobileMoney': [round(buckets[frame['key']]['mobileMoney'] / 1_000_000, 1) for frame in visible_frames],
        'revenue': [round(buckets[frame['key']]['revenue'] / 1_000_000, 1) for frame in visible_frames],
        'expenses': [round(buckets[frame['key']]['expenses'] / 1_000_000, 1) for frame in visible_frames],
    }
    score_trend = {
        'labels': [frame['label'] for frame in visible_frames],
        'values': [
            round(buckets[frame['key']]['scoreTotal'] / buckets[frame['key']]['scoreCount'])
            if buckets[frame['key']]['scoreCount']
            else 0
            for frame in visible_frames
        ],
    }
    return collections, score_trend


def build_inventory_mix(businesses: list[BusinessRegistration]) -> dict:
    totals: Counter[str] = Counter()

    for business in businesses:
        sector = business.sector or 'Unassigned'
        weight = decimal_to_float(business.inventory_value_estimate)
        totals[sector] += weight if weight > 0 else 1

    top_sectors = totals.most_common(4)
    return {
        'labels': [sector for sector, _ in top_sectors],
        'values': [round(total, 1) for _, total in top_sectors],
    }


def build_district_performance(businesses: list[BusinessRegistration]) -> dict:
    districts: dict[str, list[int]] = {}

    for business in businesses:
        district = business.district or 'Unknown'
        districts.setdefault(district, []).append(int(business.credit_score or 0))

    ranked = sorted(
        (
            {
                'district': district,
                'score': round(sum(scores) / len(scores)) if scores else 0,
            }
            for district, scores in districts.items()
        ),
        key=lambda item: item['score'],
        reverse=True,
    )[:5]

    return {
        'labels': [item['district'] for item in ranked],
        'scores': [item['score'] for item in ranked],
    }


def build_stock_alerts(businesses: list[BusinessRegistration]) -> list[dict]:
    alerts = []

    for business in businesses:
        latest_entries = {}

        for entry in sorted(
            business.normalized_workspace_payload.get('stock_entries') or [],
            key=lambda value: str(value.get('date', '')),
            reverse=True,
        ):
            item_name = str(entry.get('item_name', '')).strip()

            if not item_name:
                continue

            item_key = item_name.lower()
            if item_key not in latest_entries:
                latest_entries[item_key] = entry

        for entry in latest_entries.values():
            on_hand = parse_non_negative_int(entry.get('on_hand', 0), 'Stock on hand')
            reorder_level = parse_non_negative_int(entry.get('reorder_level', 0), 'Reorder level')

            if reorder_level <= 0 or on_hand > reorder_level:
                continue

            shortfall = reorder_level - on_hand
            severity = 'Critical' if on_hand == 0 or shortfall >= max(3, reorder_level // 2) else 'High'
            alerts.append(
                {
                    'business': business.business_name,
                    'district': business.district,
                    'category': str(entry.get('item_name', '')).strip() or business.stock_focus or business.sector,
                    'coverage': f'{on_hand} units on hand',
                    'severity': severity,
                }
            )

    if len(alerts) >= 3:
        return alerts[:3]

    fallback_businesses = sorted(
        businesses,
        key=lambda business: (
            0 if business.fraud_risk_level == 'high' else 1,
            int(business.receipt_count or 0),
            int(business.credit_score or 0),
        ),
    )

    for business in fallback_businesses:
        if any(alert['business'] == business.business_name for alert in alerts):
            continue

        alerts.append(
            {
                'business': business.business_name,
                'district': business.district,
                'category': business.stock_focus or business.sector or 'Operating records',
                'coverage': 'Follow up on record quality and operating evidence',
                'severity': 'Critical' if business.fraud_risk_level == 'high' else 'Watch',
            }
        )

        if len(alerts) == 3:
            break

    return alerts


def build_platform_bootstrap_payload() -> dict:
    businesses = list(BusinessRegistration.objects.select_related('account_user').all())
    platform_configuration = PlatformConfiguration.get_solo()
    total_businesses = len(businesses)
    district_count = len({business.district for business in businesses if business.district})
    mobile_money_linked = sum(
        1
        for business in businesses
        if business.mobile_money_number or decimal_to_float(business.average_monthly_mobile_money) > 0
    )
    credit_ready = sum(1 for business in businesses if business.is_credit_ready)
    high_risk = sum(1 for business in businesses if business.fraud_risk_level == 'high')
    watch_risk = sum(1 for business in businesses if business.fraud_risk_level == 'watch')
    collections, score_trend = build_platform_collections(businesses)
    stock_alerts = build_stock_alerts(businesses)
    average_credit_score = round(
        sum(int(business.credit_score or 0) for business in businesses) / total_businesses
    ) if total_businesses else 0
    total_mobile_money = sum(decimal_to_float(business.average_monthly_mobile_money) for business in businesses)

    return {
        'registrationForm': platform_configuration.registration_form,
        'scoreBreakdown': platform_configuration.score_breakdown,
        'loanPrograms': platform_configuration.loan_programs,
        'heroStats': [
            {'label': 'Districts live', 'value': str(district_count)},
            {
                'label': 'Mobile money capture',
                'value': f"{round((mobile_money_linked / total_businesses) * 100) if total_businesses else 0}%",
            },
            {
                'label': 'Credit-ready businesses',
                'value': f"{round((credit_ready / total_businesses) * 100) if total_businesses else 0}%",
            },
            {'label': 'Open follow-ups', 'value': str(len(stock_alerts) or high_risk + watch_risk)},
        ],
        'metrics': [
            {
                'label': 'Tracked businesses',
                'value': str(total_businesses),
                'delta': f'{district_count} districts live',
                'icon': 'shop-window',
                'tone': 'forest',
            },
            {
                'label': 'Monthly mobile money',
                'value': format_compact_ugx(total_mobile_money),
                'delta': f'{mobile_money_linked} businesses linked to digital payments',
                'icon': 'phone',
                'tone': 'amber',
            },
            {
                'label': 'Average credit score',
                'value': f'{average_credit_score} / 100',
                'delta': f'{credit_ready} businesses are ready for credit review',
                'icon': 'bar-chart-line',
                'tone': 'sage',
            },
            {
                'label': 'Follow-up alerts',
                'value': str(len(stock_alerts) or high_risk + watch_risk),
                'delta': f'{high_risk} high-risk businesses need immediate review',
                'icon': 'boxes',
                'tone': 'clay',
            },
        ],
        'collections': collections,
        'inventoryMix': build_inventory_mix(businesses),
        'scoreTrend': score_trend,
        'districtPerformance': build_district_performance(businesses),
        'stockAlerts': stock_alerts,
    }


def get_business_access_context(request: HttpRequest, business_id: int):
    business = BusinessRegistration.objects.select_related('account_user').filter(pk=business_id).first()

    if business is None:
        return None, '', False, json_response({'error': 'Business not found.'}, status=404, request=request)

    user_role = get_user_role(request.user)
    owned_business = get_owned_business(request.user)
    can_manage_business = (
        user_role == DemoAccessProfile.Role.BUSINESS_OWNER
        and owned_business is not None
        and owned_business.pk == business.pk
    )
    return business, user_role, can_manage_business, None


def append_workspace_monthly_sale(workspace: dict, stock_entry: dict, business: BusinessRegistration) -> None:
    entry_date = str(stock_entry.get('date', '')).strip()

    try:
        parsed_date = date.fromisoformat(entry_date[:10]) if entry_date else timezone.localdate()
    except ValueError:
        parsed_date = timezone.localdate()

    month_start = parsed_date.replace(day=1).isoformat()
    monthly_sales = list(workspace.get('monthly_sales') or [])
    sale_index = next(
        (index for index, sale in enumerate(monthly_sales) if str(sale.get('month_start', '')) == month_start),
        None,
    )
    sold = parse_non_negative_int(stock_entry.get('sold', 0), 'Units sold')
    selling_price = decimal_to_float(stock_entry.get('selling_price'))
    revenue_delta = sold * selling_price

    if sale_index is None:
        monthly_sales.append(
            {
                'id': f'month-{parsed_date.strftime("%Y%m")}-{business.pk}',
                'month_start': month_start,
                'label': build_workspace_month_label(month_start[:7]),
                'revenue': serialize_decimal(revenue_delta),
                'expenses': '0.00',
                'orders': sold,
                'mobile_money': '0.00',
                'cash_sales': serialize_decimal(revenue_delta),
                'supplier_payments': '0.00',
                'readiness_score': int(business.credit_readiness_score or 0),
            }
        )
    else:
        current_sale = dict(monthly_sales[sale_index])
        current_sale['revenue'] = serialize_decimal(decimal_to_float(current_sale.get('revenue')) + revenue_delta)
        current_sale['cash_sales'] = serialize_decimal(decimal_to_float(current_sale.get('cash_sales')) + revenue_delta)
        current_sale['orders'] = parse_non_negative_int(current_sale.get('orders', 0), 'Orders') + sold
        current_sale['readiness_score'] = int(business.credit_readiness_score or 0)
        monthly_sales[sale_index] = current_sale

    monthly_sales.sort(key=lambda sale: str(sale.get('month_start', '')))
    workspace['monthly_sales'] = monthly_sales


def serialize_business(business: BusinessRegistration) -> dict:
    return {
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
        'workspace': business.normalized_workspace_payload,
        'notes': business.notes,
        'account_username': business.account_user.get_username() if business.account_user_id else '',
        'created_at': business.created_at.isoformat(),
        'updated_at': business.updated_at.isoformat(),
    }


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


def platform_bootstrap(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.method != 'GET':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    return json_response(build_platform_bootstrap_payload(), request=request)


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
                '/api/platform/bootstrap/',
                '/api/demo-accounts/',
                '/api/auth/login/',
                '/api/auth/register/',
                '/api/auth/logout/',
                '/api/auth/me/',
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
            businesses = [serialize_business(owned_business)] if owned_business else []
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

    user_role = get_user_role(request.user)
    owned_business = get_owned_business(request.user)
    can_manage_business = (
        user_role == DemoAccessProfile.Role.BUSINESS_OWNER
        and owned_business is not None
        and owned_business.pk == business.pk
    )

    if not can_manage_business and not is_official_role(user_role):
        return json_response({'error': 'You do not have access to this business profile.'}, status=403, request=request)

    if request.method == 'GET':
        return json_response({'business': serialize_business(business)}, request=request)

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
def business_stock_entries(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    business, _, can_manage_business, error_response = get_business_access_context(request, business_id)
    if error_response is not None:
        return error_response

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can update stock entries.'}, status=403, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    item_name = str(payload.get('item_name', '')).strip()

    if not item_name:
        return json_response({'error': 'Stock item name is required.'}, status=400, request=request)

    try:
        stock_entry = {
            'id': f'stock-{timezone.now():%Y%m%d%H%M%S%f}',
            'date': str(payload.get('date', '')).strip() or timezone.localdate().isoformat(),
            'item_name': item_name,
            'category': str(payload.get('category', '')).strip() or business.sector or 'Retail',
            'unit': str(payload.get('unit', '')).strip() or 'units',
            'on_hand': parse_non_negative_int(payload.get('on_hand', 0), 'Stock on hand'),
            'received': parse_non_negative_int(payload.get('received', 0), 'Units received'),
            'sold': parse_non_negative_int(payload.get('sold', 0), 'Units sold'),
            'reorder_level': parse_non_negative_int(payload.get('reorder_level', 0), 'Reorder level'),
            'selling_price': serialize_decimal(parse_non_negative_decimal(payload.get('selling_price', 0), 'Selling price')),
        }
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    workspace = business.normalized_workspace_payload
    workspace['stock_entries'] = [stock_entry, *(workspace.get('stock_entries') or [])][:24]
    append_workspace_monthly_sale(workspace, stock_entry, business)
    business.workspace_payload = workspace
    business.save(ledger_actor=request.user.get_username())

    return json_response(
        {
            'message': 'Stock entry saved.',
            'business': serialize_business(business),
        },
        request=request,
    )


@csrf_exempt
def business_documents(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    business, _, can_manage_business, error_response = get_business_access_context(request, business_id)
    if error_response is not None:
        return error_response

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can update documents.'}, status=403, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    document_name = str(payload.get('name', '')).strip()

    if not document_name:
        return json_response({'error': 'Document name is required.'}, status=400, request=request)

    workspace = business.normalized_workspace_payload
    workspace['documents'] = [
        {
            'id': f'doc-{timezone.now():%Y%m%d%H%M%S%f}',
            'name': document_name,
            'type': str(payload.get('type', '')).strip() or 'General',
            'reference': str(payload.get('reference', '')).strip(),
            'due_date': str(payload.get('due_date', '')).strip(),
            'status': str(payload.get('status', '')).strip() or 'Pending',
        },
        *(workspace.get('documents') or []),
    ][:10]
    business.workspace_payload = workspace
    business.save(ledger_actor=request.user.get_username())

    return json_response(
        {
            'message': 'Document saved.',
            'business': serialize_business(business),
        },
        request=request,
    )


@csrf_exempt
def business_credit_draft(request: HttpRequest, business_id: int) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    business, _, can_manage_business, error_response = get_business_access_context(request, business_id)
    if error_response is not None:
        return error_response

    if not can_manage_business:
        return json_response({'error': 'Only the assigned business owner can update the credit draft.'}, status=403, request=request)

    if request.method != 'PATCH':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    try:
        requested_amount = serialize_decimal(parse_non_negative_decimal(payload.get('requested_amount', 0), 'Requested amount'))
    except ValueError as exc:
        return json_response({'error': str(exc)}, status=400, request=request)

    workspace = business.normalized_workspace_payload
    workspace['credit_draft'] = {
        'requested_amount': requested_amount,
        'loan_purpose': str(payload.get('loan_purpose', '')).strip(),
        'repayment_window': str(payload.get('repayment_window', '')).strip() or '6 months',
        'bookkeeping_score': clamp_score(decimal_to_float(payload.get('bookkeeping_score', 0))),
        'supplier_score': clamp_score(decimal_to_float(payload.get('supplier_score', 0))),
        'collateral_notes': str(payload.get('collateral_notes', '')).strip(),
        'registration_status': 'Database-backed draft',
    }
    business.workspace_payload = workspace
    business.save(ledger_actor=request.user.get_username())

    return json_response(
        {
            'message': 'Credit draft updated.',
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

    user_role = get_user_role(request.user)
    owned_business = get_owned_business(request.user)
    can_manage_business = (
        user_role == DemoAccessProfile.Role.BUSINESS_OWNER
        and owned_business is not None
        and owned_business.pk == business.pk
    )

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
            'business': serialize_business(business),
            'verification': verification,
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