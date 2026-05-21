from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from registry.models import BusinessRegistration, DemoAccessProfile


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

DEMO_BUSINESSES = [
    {
        'business_name': 'Demo Corner Shop',
        'owner_name': 'Harriet Nalongo',
        'phone_number': '+256700000101',
        'mobile_money_number': '+256700000101',
        'district': 'Kampala',
        'sector': 'Groceries',
        'location_description': 'Kisenyi market lane',
        'stock_focus': 'Sugar, flour, soap',
        'monthly_revenue_band': 'UGX 3M - 6M',
        'inventory_value_estimate': '950000.00',
        'average_monthly_profit': '220000.00',
        'average_monthly_mobile_money': '700000.00',
        'receipt_count': 2,
        'receipt_value_total': '350000.00',
        'employee_count': 3,
        'is_demo_account': True,
        'notes': 'Seeded business for demo flows without TIN lookup.',
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
    },
]


class Command(BaseCommand):
    help = 'Seeds demo users and business registrations for LedgerLift Uganda.'

    def handle(self, *args, **options):
        created_users = 0
        created_businesses = 0
        users_by_username = {}

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