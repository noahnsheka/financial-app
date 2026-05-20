import json
import os
from urllib.parse import urlparse

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import BusinessRegistration, DemoAccessProfile


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
    response['Access-Control-Allow-Origin'] = get_response_origin(request)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
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


def serialize_business(business: BusinessRegistration) -> dict:
    return {
        'id': business.id,
        'business_name': business.business_name,
        'owner_name': business.owner_name,
        'phone_number': business.phone_number,
        'mobile_money_number': business.mobile_money_number,
        'tin_number': business.tin_number,
        'district': business.district,
        'sector': business.sector,
        'location_description': business.location_description,
        'stock_focus': business.stock_focus,
        'monthly_revenue_band': business.monthly_revenue_band,
        'employee_count': business.employee_count,
        'is_demo_account': business.is_demo_account,
        'account_mode': business.account_mode,
        'tax_lookup_status': business.tax_lookup_status,
        'tax_lookup_status_label': business.get_tax_lookup_status_display(),
        'profile_score': business.profile_score,
        'profile_label': business.profile_label,
        'notes': business.notes,
        'created_at': business.created_at.isoformat(),
    }


def serialize_session_user(user) -> dict:
    profile = getattr(user, 'demo_profile', None)
    role = profile.role if profile else 'field_agent'
    role_label = profile.get_role_display() if profile else 'Field agent'
    recommended_page = {
        DemoAccessProfile.Role.GOVERNMENT: 'government',
        DemoAccessProfile.Role.LENDER: 'credit',
        DemoAccessProfile.Role.FIELD_AGENT: 'registration',
    }.get(role, 'dashboard')

    return {
        'username': user.username,
        'display_name': profile.display_name if profile else user.get_username(),
        'role': role,
        'role_label': role_label,
        'requires_tin': profile.requires_tin if profile else False,
        'notes': profile.notes if profile else '',
        'recommended_page': recommended_page,
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


@csrf_exempt
def business_collection(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if not request.user.is_authenticated:
        return json_response({'error': 'Authentication required.'}, status=401, request=request)

    if request.method == 'GET':
        businesses = [serialize_business(business) for business in BusinessRegistration.objects.all()[:25]]
        return json_response({'count': len(businesses), 'results': businesses}, request=request)

    if request.method != 'POST':
        return json_response({'error': 'Method not allowed.'}, status=405, request=request)

    try:
        payload = parse_request_payload(request)
    except json.JSONDecodeError:
        return json_response({'error': 'Request body must be valid JSON.'}, status=400, request=request)

    required_fields = {
        'business_name': 'Business name',
        'owner_name': 'Owner name',
        'phone_number': 'Phone number',
        'district': 'District',
        'sector': 'Business sector',
    }

    missing = [label for field, label in required_fields.items() if not str(payload.get(field, '')).strip()]
    if missing:
        return json_response({'error': 'Missing required fields.', 'fields': missing}, status=400, request=request)

    employee_count_raw = str(payload.get('employee_count', '1')).strip() or '1'

    try:
        employee_count = max(1, int(employee_count_raw))
    except ValueError:
        return json_response({'error': 'Employee count must be a whole number.'}, status=400, request=request)

    business = BusinessRegistration(
        business_name=str(payload.get('business_name', '')).strip(),
        owner_name=str(payload.get('owner_name', '')).strip(),
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
    )

    try:
        business.save()
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
        return json_response({'error': 'Username and password are required.'}, status=400, request=request)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return json_response({'error': 'Invalid username or password.'}, status=401, request=request)

    login(request, user)
    request.session.cycle_key()

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

    if not display_name or not username or not password or not confirm_password:
        return json_response({'error': 'Display name, username, password, and confirmation are required.'}, status=400, request=request)

    if len(display_name) < 3:
        return json_response({'error': 'Display name must be at least 3 characters long.'}, status=400, request=request)

    if len(username) < 3:
        return json_response({'error': 'Username must be at least 3 characters long.'}, status=400, request=request)

    if len(password) < 8:
        return json_response({'error': 'Password must be at least 8 characters long.'}, status=400, request=request)

    if password != confirm_password:
        return json_response({'error': 'Password confirmation does not match.'}, status=400, request=request)

    user_model = get_user_model()
    if user_model.objects.filter(username__iexact=username).exists():
        return json_response({'error': 'That username is already in use.'}, status=400, request=request)

    user = user_model.objects.create_user(username=username, password=password)
    DemoAccessProfile.objects.create(
        user=user,
        display_name=display_name,
        role=DemoAccessProfile.Role.FIELD_AGENT,
        requires_tin=False,
        notes='Self-registered field agent account.',
    )

    login(request, user)
    request.session.cycle_key()

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

    logout(request)
    return json_response({'message': 'Logged out.'}, request=request)


def me_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'OPTIONS':
        return options_response(request)

    if request.user.is_authenticated:
        return json_response({'user': serialize_session_user(request.user)}, request=request)

    return json_response({'user': None}, request=request)