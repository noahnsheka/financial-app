from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from registry.models import BusinessRegistration, DemoAccessProfile


User = get_user_model()

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
        'employee_count': 4,
        'is_demo_account': False,
        'notes': 'Seeded example with TIN ready for future tax API lookup.',
    },
]


class Command(BaseCommand):
    help = 'Seeds demo users and business registrations for LedgerLift Uganda.'

    def handle(self, *args, **options):
        created_users = 0
        created_businesses = 0

        for entry in DEMO_USERS:
            user, was_created = User.objects.get_or_create(
                username=entry['username'],
                defaults={'is_staff': entry['is_staff']},
            )

            user.is_staff = entry['is_staff']
            user.set_password(entry['password'])
            user.save()

            DemoAccessProfile.objects.update_or_create(
                user=user,
                defaults={
                    'display_name': entry['display_name'],
                    'role': entry['role'],
                    'requires_tin': False,
                    'notes': entry['notes'],
                },
            )

            if was_created:
                created_users += 1

        for business in DEMO_BUSINESSES:
            _, was_created = BusinessRegistration.objects.update_or_create(
                business_name=business['business_name'],
                owner_name=business['owner_name'],
                defaults=business,
            )

            if was_created:
                created_businesses += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. New users: {created_users}. New businesses: {created_businesses}.'
            )
        )