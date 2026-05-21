import hashlib
import hmac
import json

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

    business_name = models.CharField(max_length=150)
    owner_name = models.CharField(max_length=120)
    phone_number = models.CharField(max_length=20)
    mobile_money_number = models.CharField(max_length=20, blank=True)
    tin_number = models.CharField(max_length=30, blank=True, null=True)
    district = models.CharField(max_length=80)
    sector = models.CharField(max_length=80)
    location_description = models.CharField(max_length=180, blank=True)
    stock_focus = models.CharField(max_length=120, blank=True)
    monthly_revenue_band = models.CharField(max_length=80, blank=True)
    employee_count = models.PositiveSmallIntegerField(default=1)
    is_demo_account = models.BooleanField(default=False)
    tax_lookup_status = models.CharField(
        max_length=20,
        choices=TaxLookupStatus.choices,
        default=TaxLookupStatus.NOT_PROVIDED,
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.business_name} ({self.owner_name})'

    def clean(self) -> None:
        if self.tin_number and len(self.tin_number.strip()) < 8:
            raise ValidationError({'tin_number': 'TIN must be at least 8 characters when provided.'})

    def ledger_payload(self) -> dict:
        return {
            'business_name': self.business_name,
            'district': self.district,
            'employee_count': self.employee_count,
            'is_demo_account': self.is_demo_account,
            'location_description': self.location_description,
            'mobile_money_number': self.mobile_money_number,
            'monthly_revenue_band': self.monthly_revenue_band,
            'notes': self.notes,
            'owner_name': self.owner_name,
            'phone_number': self.phone_number,
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
        score = 40
        score += 12 if self.mobile_money_number else 0
        score += 18 if self.tin_number else 0
        score += 10 if self.stock_focus else 0
        score += 8 if self.monthly_revenue_band else 0
        score += 7 if self.location_description else 0
        score += min(self.employee_count, 5)
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