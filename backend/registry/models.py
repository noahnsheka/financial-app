import hashlib
import hmac
import json
from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone


GENESIS_BLOCK_HASH = '0' * 64


def serialize_hash_payload(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True, separators=(',', ':'), ensure_ascii=True)


def hash_serialized_payload(payload: dict) -> str:
    return hashlib.sha256(serialize_hash_payload(payload).encode('utf-8')).hexdigest()


def sign_serialized_payload(payload: dict) -> str:
    secret = getattr(settings, 'LEDGER_CHAIN_SECRET', settings.SECRET_KEY)
    return hmac.new(
        secret.encode('utf-8'),
        serialize_hash_payload(payload).encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()


def fingerprint_value(value: str | None) -> str:
    if not value:
        return ''

    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()


def serialize_decimal(value: Decimal | int | float | str | None) -> str:
    if value in {None, ''}:
        return '0.00'

    return format(Decimal(str(value)), '.2f')


def decimal_or_zero(value: Decimal | int | float | str | None) -> Decimal:
    if value in {None, ''}:
        return Decimal('0')

    if isinstance(value, Decimal):
        return value

    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal('0')


def int_or_zero(value: int | str | None) -> int:
    if value in {None, ''}:
        return 0

    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def clamp_score(value: float) -> int:
    return max(0, min(100, int(round(value))))


def score_ratio_range(value: float, lower: float, upper: float) -> int:
    if value <= 0 or lower <= 0 or upper <= 0:
        return 0

    if lower <= value <= upper:
        return 100

    if value < lower:
        return clamp_score((value / lower) * 100)

    return clamp_score((upper / value) * 100)


REVENUE_BAND_MIDPOINTS = {
    'Below UGX 1M': Decimal('500000'),
    'UGX 1M - 3M': Decimal('2000000'),
    'UGX 3M - 6M': Decimal('4500000'),
    'UGX 6M - 10M': Decimal('8000000'),
    'Above UGX 10M': Decimal('12000000'),
}

DEFAULT_PLATFORM_REGISTRATION_FORM = {
    'districts': ['Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbarara', 'Gulu', 'Mbale'],
    'sectors': ['Groceries', 'Beverages', 'Household goods', 'Pharmacy', 'Fresh produce', 'Airtime and utilities', 'Mixed retail'],
    'revenueBands': ['Below UGX 1M', 'UGX 1M - 3M', 'UGX 3M - 6M', 'UGX 6M - 10M', 'Above UGX 10M'],
}

DEFAULT_PLATFORM_SCORE_BREAKDOWN = [
    {
        'name': 'Profit and stock consistency',
        'weight': '35%',
        'description': 'Compares inventory values, declared profit, and operating scale so large gaps reduce trust.',
    },
    {
        'name': 'Receipt trust',
        'weight': '25%',
        'description': 'Rewards businesses that support their claims with receipt count and value coverage.',
    },
    {
        'name': 'Identity assurance',
        'weight': '20%',
        'description': 'Tracks NIN capture and the current state of identity verification.',
    },
    {
        'name': 'Record completeness',
        'weight': '20%',
        'description': 'Checks whether location, payment, stock, and revenue details are complete enough for review.',
    },
]

DEFAULT_PLATFORM_LOAN_PROGRAMS = [
    {
        'provider': 'Working Capital Window',
        'size': 'UGX 500k to 5M',
        'requirement': 'Improving score, usable receipt history, and stable operating records',
        'status': 'Programme setup',
    },
    {
        'provider': 'Inventory Growth Line',
        'size': 'UGX 1M to 8M',
        'requirement': 'Consistent stock evidence and reliable mobile money activity',
        'status': 'Partner review',
    },
]


def default_platform_registration_form() -> dict:
    return json.loads(json.dumps(DEFAULT_PLATFORM_REGISTRATION_FORM))


def default_platform_score_breakdown() -> list[dict]:
    return json.loads(json.dumps(DEFAULT_PLATFORM_SCORE_BREAKDOWN))


def default_platform_loan_programs() -> list[dict]:
    return json.loads(json.dumps(DEFAULT_PLATFORM_LOAN_PROGRAMS))


def default_owner_workspace_payload() -> dict:
    return {
        'stock_entries': [],
        'monthly_sales': [],
        'documents': [],
        'credit_draft': {
            'requested_amount': '',
            'loan_purpose': '',
            'repayment_window': '',
            'bookkeeping_score': 0,
            'supplier_score': 0,
            'collateral_notes': '',
            'registration_status': 'Not started',
        },
    }


def hash_ledger_block(*, chain_index: int, previous_hash: str, business_id: int, operation: str, payload: dict) -> str:
    block_payload = {
        'business_id': business_id,
        'chain_index': chain_index,
        'operation': operation,
        'payload': payload,
        'previous_hash': previous_hash,
    }
    return hash_serialized_payload(block_payload)


class BusinessRegistration(models.Model):
    class TaxLookupStatus(models.TextChoices):
        NOT_PROVIDED = 'not_provided', 'TIN not provided'
        READY = 'ready_for_lookup', 'Ready for tax lookup'
        DEMO = 'demo_bypass', 'Demo account bypass'

    class NINVerificationStatus(models.TextChoices):
        NOT_SUBMITTED = 'not_submitted', 'NIN not submitted'
        PENDING = 'pending', 'Pending NIRA or NITA verification'
        VERIFIED = 'verified', 'Verified through NIRA or NITA'
        MANUAL_REVIEW = 'manual_review', 'Manual review required'

    class CreditRegistrationStatus(models.TextChoices):
        NOT_STARTED = 'not_started', 'Not ready for credit registration'
        ELIGIBLE = 'eligible', 'Eligible for credit registration'
        SUBMITTED = 'submitted', 'Credit registration submitted'
        VERIFIED = 'verified', 'Credit registration verified'

    business_name = models.CharField(max_length=150)
    owner_name = models.CharField(max_length=120)
    phone_number = models.CharField(max_length=20)
    mobile_money_number = models.CharField(max_length=20, blank=True)
    tin_number = models.CharField(max_length=30, blank=True, null=True)
    nin_number = models.CharField(max_length=14, blank=True)
    nin_verification_status = models.CharField(
        max_length=20,
        choices=NINVerificationStatus.choices,
        default=NINVerificationStatus.NOT_SUBMITTED,
    )
    nin_verification_source = models.CharField(max_length=30, blank=True)
    nin_verification_notes = models.CharField(max_length=180, blank=True)
    district = models.CharField(max_length=80)
    sector = models.CharField(max_length=80)
    location_description = models.CharField(max_length=180, blank=True)
    stock_focus = models.CharField(max_length=120, blank=True)
    monthly_revenue_band = models.CharField(max_length=80, blank=True)
    inventory_value_estimate = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    average_monthly_profit = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    average_monthly_mobile_money = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    receipt_count = models.PositiveIntegerField(default=0)
    receipt_value_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    employee_count = models.PositiveSmallIntegerField(default=1)
    is_demo_account = models.BooleanField(default=False)
    tax_lookup_status = models.CharField(
        max_length=20,
        choices=TaxLookupStatus.choices,
        default=TaxLookupStatus.NOT_PROVIDED,
    )
    credit_registration_status = models.CharField(
        max_length=20,
        choices=CreditRegistrationStatus.choices,
        default=CreditRegistrationStatus.NOT_STARTED,
    )
    credit_registration_reference = models.CharField(max_length=60, blank=True)
    credit_registration_submitted_at = models.DateTimeField(null=True, blank=True)
    workspace_payload = models.JSONField(blank=True, default=default_owner_workspace_payload)
    notes = models.TextField(blank=True)
    account_user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_business',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.business_name} ({self.owner_name})'

    def clean(self) -> None:
        self.nin_number = (self.nin_number or '').strip().upper()
        inventory_value_estimate = decimal_or_zero(self.inventory_value_estimate)
        average_monthly_profit = decimal_or_zero(self.average_monthly_profit)
        average_monthly_mobile_money = decimal_or_zero(self.average_monthly_mobile_money)
        receipt_value_total = decimal_or_zero(self.receipt_value_total)

        if self.tin_number and len(self.tin_number.strip()) < 8:
            raise ValidationError({'tin_number': 'TIN must be at least 8 characters when provided.'})

        if self.nin_number and (len(self.nin_number) != 14 or not self.nin_number.isalnum()):
            raise ValidationError({'nin_number': 'NIN must be a 14-character alphanumeric Uganda national ID number.'})

        if inventory_value_estimate < 0:
            raise ValidationError({'inventory_value_estimate': 'Inventory value cannot be negative.'})

        if average_monthly_profit < 0:
            raise ValidationError({'average_monthly_profit': 'Average monthly profit cannot be negative.'})

        if average_monthly_mobile_money < 0:
            raise ValidationError({'average_monthly_mobile_money': 'Average mobile money total cannot be negative.'})

        if receipt_value_total < 0:
            raise ValidationError({'receipt_value_total': 'Receipt value total cannot be negative.'})

    def ledger_payload(self) -> dict:
        return {
            'account_user_id': self.account_user_id,
            'account_username': self.account_user.get_username() if self.account_user_id else '',
            'average_monthly_mobile_money': serialize_decimal(self.average_monthly_mobile_money),
            'average_monthly_profit': serialize_decimal(self.average_monthly_profit),
            'business_name': self.business_name,
            'credit_registration_reference': self.credit_registration_reference,
            'credit_registration_status': self.credit_registration_status,
            'district': self.district,
            'employee_count': self.employee_count,
            'inventory_value_estimate': serialize_decimal(self.inventory_value_estimate),
            'is_demo_account': self.is_demo_account,
            'location_description': self.location_description,
            'mobile_money_number': self.mobile_money_number,
            'monthly_revenue_band': self.monthly_revenue_band,
            'nin_number_fingerprint': fingerprint_value(self.nin_number),
            'nin_verification_notes': self.nin_verification_notes,
            'nin_verification_source': self.nin_verification_source,
            'nin_verification_status': self.nin_verification_status,
            'notes': self.notes,
            'owner_name': self.owner_name,
            'phone_number': self.phone_number,
            'receipt_count': self.receipt_count,
            'receipt_value_total': serialize_decimal(self.receipt_value_total),
            'sector': self.sector,
            'stock_focus': self.stock_focus,
            'tax_lookup_status': self.tax_lookup_status,
            'tin_number': self.tin_number,
        }

    def save(self, *args, **kwargs):
        ledger_actor = str(kwargs.pop('ledger_actor', '')).strip()
        existing_payload = None
        operation = BusinessRegistrationLedgerBlock.Operation.CREATE

        if self.pk:
            existing_registration = type(self).objects.filter(pk=self.pk).first()
            if existing_registration is not None:
                operation = BusinessRegistrationLedgerBlock.Operation.UPDATE
                existing_payload = existing_registration.ledger_payload()

        self.tin_number = (self.tin_number or '').strip() or None

        if self.is_demo_account:
            self.tax_lookup_status = self.TaxLookupStatus.DEMO
        elif self.tin_number:
            self.tax_lookup_status = self.TaxLookupStatus.READY
        else:
            self.tax_lookup_status = self.TaxLookupStatus.NOT_PROVIDED

        if not self.nin_number:
            self.nin_verification_status = self.NINVerificationStatus.NOT_SUBMITTED
            self.nin_verification_source = ''
            self.nin_verification_notes = ''

        if self.credit_registration_status not in {
            self.CreditRegistrationStatus.SUBMITTED,
            self.CreditRegistrationStatus.VERIFIED,
        }:
            self.credit_registration_status = (
                self.CreditRegistrationStatus.ELIGIBLE
                if self.is_credit_ready
                else self.CreditRegistrationStatus.NOT_STARTED
            )
            if self.credit_registration_status == self.CreditRegistrationStatus.NOT_STARTED:
                self.credit_registration_reference = ''
                self.credit_registration_submitted_at = None

        self.full_clean()
        pending_payload = self.ledger_payload()

        with transaction.atomic():
            result = super().save(*args, **kwargs)

            if operation == 'update' and existing_payload == pending_payload:
                return result

            BusinessRegistrationLedgerBlock.append_for_business(
                business=self,
                operation=operation,
                payload=pending_payload,
            )
            AppSecurityLedgerBlock.append_event(
                domain=AppSecurityLedgerBlock.Domain.BUSINESS_REGISTRATION,
                event_type=operation,
                entity_key=f'business_registration:{self.pk}',
                actor_identifier=ledger_actor,
                payload=pending_payload,
            )
            return result

    @property
    def profile_score(self) -> int:
        receipt_count = int_or_zero(self.receipt_count)
        employee_count = int_or_zero(self.employee_count)
        inventory_value_estimate = decimal_or_zero(self.inventory_value_estimate)
        average_monthly_profit = decimal_or_zero(self.average_monthly_profit)
        average_monthly_mobile_money = decimal_or_zero(self.average_monthly_mobile_money)
        score = 30
        score += 10 if self.mobile_money_number else 0
        score += 12 if self.tin_number else 0
        score += 8 if self.stock_focus else 0
        score += 6 if self.monthly_revenue_band else 0
        score += 6 if self.location_description else 0
        score += 6 if self.nin_number else 0
        score += 6 if receipt_count >= 5 else 0
        score += 6 if inventory_value_estimate and average_monthly_profit and average_monthly_mobile_money else 0
        score += min(employee_count, 5)
        score += 5 if not self.is_demo_account else 0
        return min(score, 100)

    @property
    def profile_label(self) -> str:
        if self.profile_score >= 80:
            return 'Strong'

        if self.profile_score >= 65:
            return 'Growing'

        return 'Emerging'

    @property
    def account_mode(self) -> str:
        return 'Demo' if self.is_demo_account else 'Live'

    @property
    def revenue_band_midpoint(self) -> Decimal:
        return REVENUE_BAND_MIDPOINTS.get(self.monthly_revenue_band, Decimal('0'))

    @property
    def receipt_trust_score(self) -> int:
        receipt_count = int_or_zero(self.receipt_count)
        receipt_value_total = decimal_or_zero(self.receipt_value_total)
        count_score = min(receipt_count, 20) / 20 * 100

        if self.revenue_band_midpoint > 0:
            value_score = min(float(receipt_value_total / self.revenue_band_midpoint) / 0.65, 1.0) * 100
        else:
            value_score = 50 if receipt_value_total > 0 else 0

        return clamp_score((count_score * 0.6) + (value_score * 0.4))

    @property
    def consistency_score(self) -> int:
        inventory_value_estimate = decimal_or_zero(self.inventory_value_estimate)
        average_monthly_profit = decimal_or_zero(self.average_monthly_profit)
        average_monthly_mobile_money = decimal_or_zero(self.average_monthly_mobile_money)
        receipt_value_total = decimal_or_zero(self.receipt_value_total)

        if self.revenue_band_midpoint <= 0:
            return 35 if any([
                inventory_value_estimate,
                average_monthly_profit,
                average_monthly_mobile_money,
            ]) else 20

        revenue_midpoint = float(self.revenue_band_midpoint)
        margin_ratio = float(average_monthly_profit / self.revenue_band_midpoint) if average_monthly_profit else 0.0
        mobile_money_ratio = float(average_monthly_mobile_money / self.revenue_band_midpoint) if average_monthly_mobile_money else 0.0
        inventory_ratio = float(inventory_value_estimate / self.revenue_band_midpoint) if inventory_value_estimate else 0.0

        scores = [
            score_ratio_range(margin_ratio, 0.08, 0.35) if average_monthly_profit else 35,
            score_ratio_range(mobile_money_ratio, 0.15, 0.9) if average_monthly_mobile_money else 35,
            score_ratio_range(inventory_ratio, 0.12, 1.4) if inventory_value_estimate else 35,
        ]

        if revenue_midpoint > 0 and receipt_value_total > 0:
            receipt_coverage_ratio = float(receipt_value_total / self.revenue_band_midpoint)
            scores.append(score_ratio_range(receipt_coverage_ratio, 0.15, 1.3))

        return clamp_score(sum(scores) / len(scores))

    @property
    def identity_trust_score(self) -> int:
        if self.nin_verification_status == self.NINVerificationStatus.VERIFIED:
            return 100

        if self.nin_verification_status == self.NINVerificationStatus.MANUAL_REVIEW:
            return 70

        if self.nin_verification_status == self.NINVerificationStatus.PENDING:
            return 55

        return 45 if self.nin_number else 20

    @property
    def credit_readiness_score(self) -> int:
        score = (self.profile_score * 0.35) + (self.consistency_score * 0.4) + (self.receipt_trust_score * 0.25)

        if self.is_demo_account:
            return min(clamp_score(score), 55)

        return clamp_score(score)

    @property
    def credit_score(self) -> int:
        return clamp_score((self.credit_readiness_score * 0.75) + (self.identity_trust_score * 0.25))

    @property
    def credit_label(self) -> str:
        if self.credit_score >= 80:
            return 'Credit ready'

        if self.credit_score >= 65:
            return 'Conditional review'

        return 'Build more evidence'

    @property
    def is_credit_ready(self) -> bool:
        return not self.is_demo_account and self.credit_readiness_score >= 70

    @property
    def fraud_risk_level(self) -> str:
        if self.consistency_score >= 80:
            return 'low'

        if self.consistency_score >= 60:
            return 'watch'

        return 'high'

    @property
    def credit_signal_gaps(self) -> list[str]:
        receipt_count = int_or_zero(self.receipt_count)
        average_monthly_profit = decimal_or_zero(self.average_monthly_profit)
        gaps = []

        if not self.nin_number:
            gaps.append('Add the owner NIN to start identity verification with NIRA or NITA.')

        if receipt_count < 5:
            gaps.append('Upload more receipt evidence to strengthen the trust score.')

        if self.consistency_score < 60:
            gaps.append('Inventory, profit, mobile money, and receipt totals do not align closely enough yet.')

        if not average_monthly_profit:
            gaps.append('Add monthly profit figures so the credit engine can compare operating performance.')

        return gaps

    @property
    def normalized_workspace_payload(self) -> dict:
        defaults = default_owner_workspace_payload()
        payload = self.workspace_payload if isinstance(self.workspace_payload, dict) else {}

        normalized = {
            'stock_entries': list(payload.get('stock_entries') or defaults['stock_entries']),
            'monthly_sales': list(payload.get('monthly_sales') or defaults['monthly_sales']),
            'documents': list(payload.get('documents') or defaults['documents']),
            'credit_draft': dict(defaults['credit_draft']),
        }
        normalized['credit_draft'].update(payload.get('credit_draft') or {})
        return normalized


class PlatformConfiguration(models.Model):
    singleton_id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    registration_form = models.JSONField(default=default_platform_registration_form)
    score_breakdown = models.JSONField(default=default_platform_score_breakdown)
    loan_programs = models.JSONField(default=default_platform_loan_programs)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'platform configuration'
        verbose_name_plural = 'platform configuration'

    def save(self, *args, **kwargs):
        self.singleton_id = 1
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return 'Platform configuration'

    @classmethod
    def get_solo(cls):
        return cls.objects.get_or_create(singleton_id=1)[0]


class BusinessRegistrationChainState(models.Model):
    singleton_id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    latest_index = models.PositiveBigIntegerField(default=0)
    latest_hash = models.CharField(max_length=64, default=GENESIS_BLOCK_HASH)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'business registration ledger state'
        verbose_name_plural = 'business registration ledger state'

    def save(self, *args, **kwargs):
        self.singleton_id = 1
        if not self.latest_hash:
            self.latest_hash = GENESIS_BLOCK_HASH
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'Ledger state at block {self.latest_index}'


class BusinessRegistrationLedgerBlock(models.Model):
    class Operation(models.TextChoices):
        CREATE = 'create', 'Create'
        UPDATE = 'update', 'Update'

    business = models.ForeignKey(BusinessRegistration, on_delete=models.PROTECT, related_name='ledger_blocks')
    chain_index = models.PositiveBigIntegerField(unique=True, editable=False)
    operation = models.CharField(max_length=10, choices=Operation.choices)
    previous_hash = models.CharField(max_length=64, editable=False)
    block_hash = models.CharField(max_length=64, unique=True, editable=False)
    payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['chain_index']

    def __str__(self) -> str:
        return f'Block {self.chain_index} for registration {self.business_id}'

    @classmethod
    def append_for_business(cls, *, business: BusinessRegistration, operation: str, payload: dict):
        chain_state, _ = BusinessRegistrationChainState.objects.select_for_update().get_or_create(
            singleton_id=1,
            defaults={
                'latest_hash': GENESIS_BLOCK_HASH,
                'latest_index': 0,
            },
        )
        next_index = chain_state.latest_index + 1
        previous_hash = chain_state.latest_hash or GENESIS_BLOCK_HASH
        block_hash = hash_ledger_block(
            chain_index=next_index,
            previous_hash=previous_hash,
            business_id=business.pk,
            operation=operation,
            payload=payload,
        )

        block = cls.objects.create(
            business=business,
            chain_index=next_index,
            operation=operation,
            previous_hash=previous_hash,
            block_hash=block_hash,
            payload=payload,
        )

        chain_state.latest_index = next_index
        chain_state.latest_hash = block_hash
        chain_state.save()
        return block

    @classmethod
    def verify_chain(cls) -> dict:
        expected_previous = GENESIS_BLOCK_HASH
        expected_index = 1

        for block in cls.objects.order_by('chain_index'):
            recalculated_hash = hash_ledger_block(
                chain_index=block.chain_index,
                previous_hash=block.previous_hash,
                business_id=block.business_id,
                operation=block.operation,
                payload=block.payload,
            )

            if block.chain_index != expected_index:
                return {
                    'error': f'Expected block index {expected_index} but found {block.chain_index}.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'total_blocks': expected_index - 1,
                }

            if block.previous_hash != expected_previous:
                return {
                    'error': f'Block {block.chain_index} previous hash does not match the chain head.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'total_blocks': expected_index - 1,
                }

            if block.block_hash != recalculated_hash:
                return {
                    'error': f'Block {block.chain_index} hash does not match its stored payload.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'total_blocks': expected_index - 1,
                }

            expected_previous = block.block_hash
            expected_index += 1

        total_blocks = expected_index - 1
        latest_hash = expected_previous if total_blocks else GENESIS_BLOCK_HASH
        chain_state = BusinessRegistrationChainState.objects.filter(singleton_id=1).first()

        if chain_state and (
            chain_state.latest_index != total_blocks or chain_state.latest_hash != latest_hash
        ):
            return {
                'error': 'Ledger state does not match the last recorded block.',
                'failed_block': total_blocks,
                'is_valid': False,
                'latest_hash': latest_hash,
                'total_blocks': total_blocks,
            }

        return {
            'error': '',
            'failed_block': None,
            'is_valid': True,
            'latest_hash': latest_hash,
            'total_blocks': total_blocks,
        }


class AppSecurityChainState(models.Model):
    singleton_id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    latest_index = models.PositiveBigIntegerField(default=0)
    latest_hash = models.CharField(max_length=64, default=GENESIS_BLOCK_HASH)
    latest_signature = models.CharField(max_length=64, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'app security ledger state'
        verbose_name_plural = 'app security ledger state'

    def save(self, *args, **kwargs):
        self.singleton_id = 1
        if not self.latest_hash:
            self.latest_hash = GENESIS_BLOCK_HASH
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'App security ledger state at block {self.latest_index}'


class AppSecurityLedgerBlock(models.Model):
    class Domain(models.TextChoices):
        AUTH = 'auth', 'Authentication'
        BUSINESS_REGISTRATION = 'business_registration', 'Business registration'
        DEMO_ACCESS_PROFILE = 'demo_access_profile', 'Demo access profile'
        USER_ACCOUNT = 'user_account', 'User account'

    chain_index = models.PositiveBigIntegerField(unique=True, editable=False)
    domain = models.CharField(max_length=40, choices=Domain.choices)
    event_type = models.CharField(max_length=40)
    entity_key = models.CharField(max_length=160)
    actor_identifier = models.CharField(max_length=120, blank=True)
    previous_hash = models.CharField(max_length=64, editable=False)
    block_hash = models.CharField(max_length=64, unique=True, editable=False)
    signature = models.CharField(max_length=64, editable=False)
    payload = models.JSONField()
    recorded_at = models.DateTimeField(editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['chain_index']

    def __str__(self) -> str:
        return f'App security block {self.chain_index} ({self.domain}:{self.event_type})'

    @classmethod
    def build_block_payload(
        cls,
        *,
        chain_index: int,
        domain: str,
        event_type: str,
        entity_key: str,
        actor_identifier: str,
        previous_hash: str,
        payload: dict,
        recorded_at,
    ) -> dict:
        return {
            'actor_identifier': actor_identifier,
            'chain_index': chain_index,
            'domain': domain,
            'entity_key': entity_key,
            'event_type': event_type,
            'payload': payload,
            'previous_hash': previous_hash,
            'recorded_at': recorded_at.isoformat(),
        }

    @classmethod
    def append_event(
        cls,
        *,
        domain: str,
        event_type: str,
        entity_key: str,
        payload: dict,
        actor_identifier: str = '',
    ):
        actor_identifier = str(actor_identifier).strip()
        payload = dict(payload)
        recorded_at = timezone.now()

        with transaction.atomic():
            chain_state, _ = AppSecurityChainState.objects.select_for_update().get_or_create(
                singleton_id=1,
                defaults={
                    'latest_hash': GENESIS_BLOCK_HASH,
                    'latest_index': 0,
                    'latest_signature': '',
                },
            )
            next_index = chain_state.latest_index + 1
            previous_hash = chain_state.latest_hash or GENESIS_BLOCK_HASH
            block_payload = cls.build_block_payload(
                chain_index=next_index,
                domain=domain,
                event_type=event_type,
                entity_key=entity_key,
                actor_identifier=actor_identifier,
                previous_hash=previous_hash,
                payload=payload,
                recorded_at=recorded_at,
            )
            block_hash = hash_serialized_payload(block_payload)
            signature = sign_serialized_payload(block_payload)

            block = cls.objects.create(
                chain_index=next_index,
                domain=domain,
                event_type=event_type,
                entity_key=entity_key,
                actor_identifier=actor_identifier,
                previous_hash=previous_hash,
                block_hash=block_hash,
                signature=signature,
                payload=payload,
                recorded_at=recorded_at,
            )

            chain_state.latest_index = next_index
            chain_state.latest_hash = block_hash
            chain_state.latest_signature = signature
            chain_state.save()
            return block

    @classmethod
    def verify_chain(cls) -> dict:
        expected_previous = GENESIS_BLOCK_HASH
        expected_index = 1
        latest_signature = ''

        for block in cls.objects.order_by('chain_index'):
            block_payload = cls.build_block_payload(
                chain_index=block.chain_index,
                domain=block.domain,
                event_type=block.event_type,
                entity_key=block.entity_key,
                actor_identifier=block.actor_identifier,
                previous_hash=block.previous_hash,
                payload=block.payload,
                recorded_at=block.recorded_at,
            )
            recalculated_hash = hash_serialized_payload(block_payload)
            recalculated_signature = sign_serialized_payload(block_payload)

            if block.chain_index != expected_index:
                return {
                    'error': f'Expected security block index {expected_index} but found {block.chain_index}.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'latest_signature': latest_signature,
                    'signature_algorithm': 'hmac-sha256',
                    'total_blocks': expected_index - 1,
                }

            if block.previous_hash != expected_previous:
                return {
                    'error': f'Security block {block.chain_index} previous hash does not match the chain head.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'latest_signature': latest_signature,
                    'signature_algorithm': 'hmac-sha256',
                    'total_blocks': expected_index - 1,
                }

            if block.block_hash != recalculated_hash:
                return {
                    'error': f'Security block {block.chain_index} hash does not match its stored payload.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'latest_signature': latest_signature,
                    'signature_algorithm': 'hmac-sha256',
                    'total_blocks': expected_index - 1,
                }

            if block.signature != recalculated_signature:
                return {
                    'error': f'Security block {block.chain_index} signature is invalid.',
                    'failed_block': block.chain_index,
                    'is_valid': False,
                    'latest_hash': expected_previous,
                    'latest_signature': latest_signature,
                    'signature_algorithm': 'hmac-sha256',
                    'total_blocks': expected_index - 1,
                }

            expected_previous = block.block_hash
            latest_signature = block.signature
            expected_index += 1

        total_blocks = expected_index - 1
        latest_hash = expected_previous if total_blocks else GENESIS_BLOCK_HASH
        chain_state = AppSecurityChainState.objects.filter(singleton_id=1).first()

        if chain_state and (
            chain_state.latest_index != total_blocks
            or chain_state.latest_hash != latest_hash
            or chain_state.latest_signature != latest_signature
        ):
            return {
                'error': 'App security ledger state does not match the last recorded block.',
                'failed_block': total_blocks,
                'is_valid': False,
                'latest_hash': latest_hash,
                'latest_signature': latest_signature,
                'signature_algorithm': 'hmac-sha256',
                'total_blocks': total_blocks,
            }

        return {
            'error': '',
            'failed_block': None,
            'is_valid': True,
            'latest_hash': latest_hash,
            'latest_signature': latest_signature,
            'signature_algorithm': 'hmac-sha256',
            'total_blocks': total_blocks,
        }


class DemoAccessProfile(models.Model):
    class Role(models.TextChoices):
        GOVERNMENT = 'government', 'Government officer'
        LENDER = 'lender', 'Lender'
        FIELD_AGENT = 'field_agent', 'Field agent'
        BUSINESS_OWNER = 'business_owner', 'Business owner'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='demo_profile')
    display_name = models.CharField(max_length=120)
    role = models.CharField(max_length=20, choices=Role.choices)
    requires_tin = models.BooleanField(default=False)
    notes = models.CharField(max_length=180, blank=True)

    def __str__(self) -> str:
        return f'{self.display_name} ({self.get_role_display()})'

    def ledger_payload(self) -> dict:
        return {
            'display_name': self.display_name,
            'notes': self.notes,
            'requires_tin': self.requires_tin,
            'role': self.role,
            'user_id': self.user_id,
            'username': self.user.get_username() if self.user_id else '',
        }

    def save(self, *args, **kwargs):
        ledger_actor = str(kwargs.pop('ledger_actor', '')).strip()
        existing_payload = None
        operation = 'create'

        if self.pk:
            existing_profile = type(self).objects.select_related('user').filter(pk=self.pk).first()
            if existing_profile is not None:
                operation = 'update'
                existing_payload = existing_profile.ledger_payload()

        pending_payload = self.ledger_payload()

        with transaction.atomic():
            result = super().save(*args, **kwargs)

            if operation == 'update' and existing_payload == pending_payload:
                return result

            AppSecurityLedgerBlock.append_event(
                domain=AppSecurityLedgerBlock.Domain.DEMO_ACCESS_PROFILE,
                event_type=operation,
                entity_key=f'demo_access_profile:{self.pk}',
                actor_identifier=ledger_actor or (self.user.get_username() if self.user_id else ''),
                payload=pending_payload,
            )
            return result


def user_account_payload(user) -> dict:
    return {
        'email': getattr(user, 'email', ''),
        'is_active': user.is_active,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'password_fingerprint': fingerprint_value(user.password),
        'username': user.get_username(),
    }


@receiver(pre_save, sender=settings.AUTH_USER_MODEL)
def cache_existing_user_payload(sender, instance, **kwargs):
    instance._previous_user_ledger_payload = None

    if instance.pk:
        existing_user = sender.objects.filter(pk=instance.pk).first()
        if existing_user is not None:
            instance._previous_user_ledger_payload = user_account_payload(existing_user)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def append_user_account_security_event(sender, instance, created, **kwargs):
    previous_payload = getattr(instance, '_previous_user_ledger_payload', None)
    current_payload = user_account_payload(instance)

    if hasattr(instance, '_previous_user_ledger_payload'):
        delattr(instance, '_previous_user_ledger_payload')

    if not created and previous_payload == current_payload:
        return

    actor_identifier = str(getattr(instance, '_ledger_actor', '')).strip() or instance.get_username()

    if hasattr(instance, '_ledger_actor'):
        delattr(instance, '_ledger_actor')

    AppSecurityLedgerBlock.append_event(
        domain=AppSecurityLedgerBlock.Domain.USER_ACCOUNT,
        event_type='create' if created else 'update',
        entity_key=f'user_account:{instance.pk}',
        actor_identifier=actor_identifier,
        payload=current_payload,
    )