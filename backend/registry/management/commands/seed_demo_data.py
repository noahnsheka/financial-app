from datetime import date

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from registry.models import BusinessRegistration, DemoAccessProfile, PlatformConfiguration


User = get_user_model()
SYSTEM_ACTOR = 'system:seed_demo_data'

DEMO_USERS = [
    {
        'username': 'gov.officer',
        'password': 'GovDemo123!',
        'display_name': 'NITA Pilot Officer',
        'role': DemoAccessProfile.Role.GOVERNMENT,
        'notes': 'Use for government oversight demonstrations.',
        'is_staff': True,
    },
    {
        'username': 'lender.partner',
        'password': 'LenderDemo123!',
        'display_name': 'Microfinance Partner',
        'role': DemoAccessProfile.Role.LENDER,
        'notes': 'Use for lender workflow demos without a TIN requirement.',
        'is_staff': False,
    },
    {
        'username': 'field.agent',
        'password': 'FieldDemo123!',
        'display_name': 'Field Agent Kampala',
        'role': DemoAccessProfile.Role.FIELD_AGENT,
        'notes': 'Use for shop onboarding and registration walkthroughs.',
        'is_staff': False,
    },
    {
        'username': 'paul.owner',
        'password': 'OwnerDemo123!',
        'display_name': 'Paul Ssenfuka',
        'role': DemoAccessProfile.Role.BUSINESS_OWNER,
        'notes': 'Use for business-owner dashboards and profile adjustments.',
        'is_staff': False,
    },
]

PLATFORM_CONFIGURATION = {
    'registration_form': {
        'districts': ['Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbarara', 'Gulu', 'Mbale'],
        'sectors': ['Groceries', 'Beverages', 'Household goods', 'Pharmacy', 'Fresh produce', 'Airtime and utilities', 'Mixed retail'],
        'revenueBands': ['Below UGX 1M', 'UGX 1M - 3M', 'UGX 3M - 6M', 'UGX 6M - 10M', 'Above UGX 10M'],
    },
    'score_breakdown': [
        {
            'name': 'Profit and stock consistency',
            'weight': '35%',
            'description': 'Compares inventory values, declared profit, and business size so suspicious gaps reduce the credit percentage.',
        },
        {
            'name': 'Receipt trust',
            'weight': '25%',
            'description': 'Rewards businesses that can back their claims with more receipts and stronger receipt-value coverage.',
        },
        {
            'name': 'Identity assurance',
            'weight': '20%',
            'description': 'Tracks when a ready business has submitted a NIN and whether NIRA or NITA verification has cleared it.',
        },
        {
            'name': 'Record completeness',
            'weight': '20%',
            'description': 'Checks whether sales, location, stock, and digital payment details are complete enough to trust the credit model.',
        },
    ],
    'loan_programs': [
        {
            'provider': 'Growth Window',
            'size': 'UGX 2M to 10M',
            'requirement': 'Credit score 70+, NIN submission, 90 days of consistent records',
            'status': 'Open for pilot',
        },
        {
            'provider': 'Inventory Bridge',
            'size': 'UGX 500k to 3M',
            'requirement': 'Strong stock-profit alignment and receipt support',
            'status': 'Partner review',
        },
        {
            'provider': 'Women in Trade Fund',
            'size': 'UGX 1M to 6M',
            'requirement': 'Verified owner NIN, credit score 68+, strong digital history',
            'status': 'Priority channel',
        },
    ],
}


def shift_month(reference_month: date, months_back: int) -> date:
    year = reference_month.year
    month = reference_month.month - months_back

    while month <= 0:
        month += 12
        year -= 1

    return date(year, month, 1)


def build_monthly_sales(*, revenue_start: int, revenue_step: int, expense_ratio: float, readiness_start: int) -> list[dict]:
    reference_month = timezone.now().date().replace(day=1)
    monthly_sales = []

    for offset in range(5, -1, -1):
        month_start = shift_month(reference_month, offset)
        index = 5 - offset
        revenue = revenue_start + (revenue_step * index)
        expenses = round(revenue * expense_ratio)
        mobile_money = round(revenue * 0.63)
        supplier_payments = round(expenses * 0.62)

        monthly_sales.append(
            {
                'id': f'seed-month-{month_start.isoformat()}',
                'month_start': month_start.isoformat(),
                'label': month_start.strftime('%b'),
                'revenue': f'{revenue:.2f}',
                'expenses': f'{expenses:.2f}',
                'orders': 82 + (index * 9),
                'mobile_money': f'{mobile_money:.2f}',
                'cash_sales': f'{(revenue - mobile_money):.2f}',
                'supplier_payments': f'{supplier_payments:.2f}',
                'readiness_score': readiness_start + (index * 2),
            }
        )

    return monthly_sales


def build_stock_entries(*, stock_focus: str, sector: str, base_on_hand: int) -> list[dict]:
    items = [item.strip() for item in stock_focus.split(',') if item.strip()] or [sector]
    return [
        {
            'id': f'seed-stock-{index}',
            'date': (timezone.now().date()).isoformat(),
            'item_name': item,
            'category': sector,
            'unit': 'units',
            'on_hand': max(4, base_on_hand - (index * 4)),
            'received': 10 + (index * 3),
            'sold': 6 + (index * 2),
            'reorder_level': 10 + (index * 2),
            'selling_price': f'{(2800 + (index * 500)):.2f}',
        }
        for index, item in enumerate(items[:3])
    ]


def build_documents(*, tin_number: str) -> list[dict]:
    return [
        {
            'id': 'seed-doc-licence',
            'name': 'Trading licence',
            'type': 'Compliance',
            'reference': 'TRD-2026-114',
            'due_date': shift_month(timezone.now().date().replace(day=1), -1).isoformat(),
            'status': 'Ready',
        },
        {
            'id': 'seed-doc-statement',
            'name': 'Mobile money statement',
            'type': 'Finance',
            'reference': 'Last 90 days',
            'due_date': timezone.now().date().isoformat(),
            'status': 'Ready',
        },
        {
            'id': 'seed-doc-tax',
            'name': 'TIN and tax summary',
            'type': 'Tax',
            'reference': tin_number or 'TIN pending',
            'due_date': '',
            'status': 'Ready' if tin_number else 'Pending',
        },
    ]


def build_credit_draft(*, requested_amount: int, loan_purpose: str, bookkeeping_score: int, supplier_score: int) -> dict:
    return {
        'requested_amount': f'{requested_amount:.2f}',
        'loan_purpose': loan_purpose,
        'repayment_window': '6 months',
        'bookkeeping_score': bookkeeping_score,
        'supplier_score': supplier_score,
        'collateral_notes': 'Inventory, receipt trail, and mobile-money history available for review.',
        'registration_status': 'Database-backed draft',
        'updated_at': timezone.now().isoformat(),
    }


def build_workspace_payload(*, stock_focus: str, sector: str, tin_number: str, revenue_start: int, revenue_step: int, expense_ratio: float, readiness_start: int, requested_amount: int, loan_purpose: str, bookkeeping_score: int, supplier_score: int, base_on_hand: int) -> dict:
    return {
        'stock_entries': build_stock_entries(stock_focus=stock_focus, sector=sector, base_on_hand=base_on_hand),
        'documents': build_documents(tin_number=tin_number),
        'monthly_sales': build_monthly_sales(
            revenue_start=revenue_start,
            revenue_step=revenue_step,
            expense_ratio=expense_ratio,
            readiness_start=readiness_start,
        ),
        'credit_draft': build_credit_draft(
            requested_amount=requested_amount,
            loan_purpose=loan_purpose,
            bookkeeping_score=bookkeeping_score,
            supplier_score=supplier_score,
        ),
    }

DEMO_BUSINESSES = [
    {
        'business_name': 'Amina Retail Hub',
        'owner_name': 'Amina Nankya',
        'phone_number': '+256700100001',
        'mobile_money_number': '+256700100001',
        'tin_number': '1002003001',
        'district': 'Kampala',
        'sector': 'Groceries',
        'location_description': 'Kisenyi market lane',
        'stock_focus': 'Sugar, flour, soap',
        'monthly_revenue_band': 'UGX 6M - 10M',
        'inventory_value_estimate': '2400000.00',
        'average_monthly_profit': '820000.00',
        'average_monthly_mobile_money': '4100000.00',
        'receipt_count': 11,
        'receipt_value_total': '3100000.00',
        'employee_count': 4,
        'is_demo_account': False,
        'notes': 'Live seeded business for registry analytics.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Sugar, flour, soap',
            sector='Groceries',
            tin_number='1002003001',
            revenue_start=4700000,
            revenue_step=180000,
            expense_ratio=0.67,
            readiness_start=70,
            requested_amount=1800000,
            loan_purpose='Increase staple stock depth',
            bookkeeping_score=78,
            supplier_score=74,
            base_on_hand=18,
        ),
    },
    {
        'business_name': 'Wakiso Home Goods',
        'owner_name': 'Paul Ssenfuka',
        'phone_number': '+256700000202',
        'mobile_money_number': '+256700000202',
        'tin_number': '1002003004',
        'district': 'Wakiso',
        'sector': 'Household goods',
        'location_description': 'Bwebajja trading center',
        'stock_focus': 'Cleaning supplies and cooking oil',
        'monthly_revenue_band': 'UGX 6M - 10M',
        'inventory_value_estimate': '2800000.00',
        'average_monthly_profit': '980000.00',
        'average_monthly_mobile_money': '4700000.00',
        'receipt_count': 14,
        'receipt_value_total': '4200000.00',
        'employee_count': 4,
        'is_demo_account': False,
        'account_username': 'paul.owner',
        'notes': 'Seeded example with strong records so the owner can open the NIN-backed credit registration flow immediately.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Cleaning supplies, cooking oil, tissue packs',
            sector='Household goods',
            tin_number='1002003004',
            revenue_start=5300000,
            revenue_step=210000,
            expense_ratio=0.65,
            readiness_start=74,
            requested_amount=2400000,
            loan_purpose='Increase household goods stock depth',
            bookkeeping_score=82,
            supplier_score=79,
            base_on_hand=26,
        ),
    },
    {
        'business_name': 'Kasana Home Store',
        'owner_name': 'Ronald Kasana',
        'phone_number': '+256700100002',
        'mobile_money_number': '+256700100002',
        'tin_number': '1002003002',
        'district': 'Wakiso',
        'sector': 'Household goods',
        'location_description': 'Bwebajja trading center',
        'stock_focus': 'Cleaning supplies, cooking oil, containers',
        'monthly_revenue_band': 'UGX 3M - 6M',
        'inventory_value_estimate': '1800000.00',
        'average_monthly_profit': '620000.00',
        'average_monthly_mobile_money': '2800000.00',
        'receipt_count': 8,
        'receipt_value_total': '1700000.00',
        'employee_count': 3,
        'is_demo_account': False,
        'notes': 'Live seeded business for household goods reporting.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Cleaning supplies, cooking oil, containers',
            sector='Household goods',
            tin_number='1002003002',
            revenue_start=3600000,
            revenue_step=145000,
            expense_ratio=0.68,
            readiness_start=66,
            requested_amount=1500000,
            loan_purpose='Buy more durable household stock',
            bookkeeping_score=69,
            supplier_score=68,
            base_on_hand=14,
        ),
    },
    {
        'business_name': 'Jinja Lakeside Shop',
        'owner_name': 'Sarah Nabulime',
        'phone_number': '+256700100003',
        'mobile_money_number': '+256700100003',
        'tin_number': '',
        'district': 'Jinja',
        'sector': 'Beverages',
        'location_description': 'Near Jinja main street',
        'stock_focus': 'Soft drinks, bottled water, juice',
        'monthly_revenue_band': 'UGX 3M - 6M',
        'inventory_value_estimate': '1650000.00',
        'average_monthly_profit': '510000.00',
        'average_monthly_mobile_money': '2450000.00',
        'receipt_count': 6,
        'receipt_value_total': '1400000.00',
        'employee_count': 2,
        'is_demo_account': False,
        'notes': 'Live seeded beverage business.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Soft drinks, bottled water, juice',
            sector='Beverages',
            tin_number='',
            revenue_start=3300000,
            revenue_step=120000,
            expense_ratio=0.7,
            readiness_start=61,
            requested_amount=1200000,
            loan_purpose='Improve beverage refrigeration stock cycle',
            bookkeeping_score=63,
            supplier_score=60,
            base_on_hand=12,
        ),
    },
    {
        'business_name': 'Mbarara Market Corner',
        'owner_name': 'Brian Turyasingura',
        'phone_number': '+256700100004',
        'mobile_money_number': '+256700100004',
        'tin_number': '1002003005',
        'district': 'Mbarara',
        'sector': 'Mixed retail',
        'location_description': 'Central market row B',
        'stock_focus': 'Dry goods, packaged foods, toiletries',
        'monthly_revenue_band': 'UGX 6M - 10M',
        'inventory_value_estimate': '2100000.00',
        'average_monthly_profit': '710000.00',
        'average_monthly_mobile_money': '3100000.00',
        'receipt_count': 9,
        'receipt_value_total': '2500000.00',
        'employee_count': 4,
        'is_demo_account': False,
        'notes': 'Live seeded mixed-retail business.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Dry goods, packaged foods, toiletries',
            sector='Mixed retail',
            tin_number='1002003005',
            revenue_start=4300000,
            revenue_step=160000,
            expense_ratio=0.69,
            readiness_start=68,
            requested_amount=1700000,
            loan_purpose='Expand packaged food inventory',
            bookkeeping_score=72,
            supplier_score=70,
            base_on_hand=11,
        ),
    },
    {
        'business_name': 'Northern Fresh Point',
        'owner_name': 'Grace Acen',
        'phone_number': '+256700100005',
        'mobile_money_number': '+256700100005',
        'tin_number': '',
        'district': 'Gulu',
        'sector': 'Fresh produce',
        'location_description': 'Near Gulu taxi park',
        'stock_focus': 'Produce, cold drinks, tomatoes',
        'monthly_revenue_band': 'UGX 1M - 3M',
        'inventory_value_estimate': '980000.00',
        'average_monthly_profit': '260000.00',
        'average_monthly_mobile_money': '980000.00',
        'receipt_count': 4,
        'receipt_value_total': '620000.00',
        'employee_count': 2,
        'is_demo_account': False,
        'notes': 'Live seeded produce business with weaker evidence.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Produce, cold drinks, tomatoes',
            sector='Fresh produce',
            tin_number='',
            revenue_start=1600000,
            revenue_step=90000,
            expense_ratio=0.75,
            readiness_start=54,
            requested_amount=650000,
            loan_purpose='Improve produce freshness and stock turnover',
            bookkeeping_score=52,
            supplier_score=49,
            base_on_hand=8,
        ),
    },
    {
        'business_name': 'Mukono Digital Kiosk',
        'owner_name': 'Isaac Ssembajja',
        'phone_number': '+256700100006',
        'mobile_money_number': '+256700100006',
        'tin_number': '1002003006',
        'district': 'Mukono',
        'sector': 'Airtime and utilities',
        'location_description': 'Mukono town center',
        'stock_focus': 'Airtime, data bundles, utility collections',
        'monthly_revenue_band': 'UGX 1M - 3M',
        'inventory_value_estimate': '740000.00',
        'average_monthly_profit': '330000.00',
        'average_monthly_mobile_money': '1600000.00',
        'receipt_count': 10,
        'receipt_value_total': '1100000.00',
        'employee_count': 1,
        'is_demo_account': False,
        'notes': 'Live seeded digital kiosk business.',
        'workspace_payload': build_workspace_payload(
            stock_focus='Airtime, data bundles, utility collections',
            sector='Airtime and utilities',
            tin_number='1002003006',
            revenue_start=2200000,
            revenue_step=110000,
            expense_ratio=0.61,
            readiness_start=71,
            requested_amount=980000,
            loan_purpose='Increase working capital for digital float',
            bookkeeping_score=77,
            supplier_score=75,
            base_on_hand=22,
        ),
    },
]


class Command(BaseCommand):
    help = 'Seeds demo users and business registrations for LedgerLift Uganda.'

    def handle(self, *args, **options):
        created_users = 0
        created_businesses = 0
        users_by_username = {}

        platform_configuration, _ = PlatformConfiguration.objects.get_or_create(singleton_id=1)
        platform_configuration.registration_form = PLATFORM_CONFIGURATION['registration_form']
        platform_configuration.score_breakdown = PLATFORM_CONFIGURATION['score_breakdown']
        platform_configuration.loan_programs = PLATFORM_CONFIGURATION['loan_programs']
        platform_configuration.save()

        for entry in DEMO_USERS:
            user = User.objects.filter(username=entry['username']).first()
            was_created = user is None

            if user is None:
                user = User(username=entry['username'])

            user.is_staff = entry['is_staff']
            user._ledger_actor = SYSTEM_ACTOR
            user.set_password(entry['password'])
            user.save()

            profile = DemoAccessProfile.objects.filter(user=user).first()
            if profile is None:
                profile = DemoAccessProfile(user=user)

            profile.display_name = entry['display_name']
            profile.role = entry['role']
            profile.requires_tin = False
            profile.notes = entry['notes']
            profile.save(ledger_actor=SYSTEM_ACTOR)
            users_by_username[user.username] = user

            if was_created:
                created_users += 1

        for business in DEMO_BUSINESSES:
            business_registration = BusinessRegistration.objects.filter(
                business_name=business['business_name'],
                owner_name=business['owner_name'],
            ).first()
            was_created = business_registration is None

            if business_registration is None:
                business_registration = BusinessRegistration()

            for field_name, value in business.items():
                if field_name == 'account_username':
                    continue
                setattr(business_registration, field_name, value)

            account_username = str(business.get('account_username', '')).strip()
            business_registration.account_user = users_by_username.get(account_username) if account_username else None

            business_registration.save(ledger_actor=SYSTEM_ACTOR)

            if was_created:
                created_businesses += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. New users: {created_users}. New businesses: {created_businesses}.'
            )
        )