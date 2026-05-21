import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from .models import (
    GENESIS_BLOCK_HASH,
    AppSecurityChainState,
    AppSecurityLedgerBlock,
    BusinessRegistration,
    BusinessRegistrationChainState,
    BusinessRegistrationLedgerBlock,
    DemoAccessProfile,
)


def create_business(**overrides) -> BusinessRegistration:
    payload = {
        'business_name': 'LedgerLift Foods',
        'owner_name': 'Asha Namugenyi',
        'phone_number': '+256700111222',
        'mobile_money_number': '+256700111222',
        'tin_number': '12345678',
        'district': 'Kampala',
        'sector': 'Retail',
        'location_description': 'Ntinda trading centre',
        'stock_focus': 'Rice and beans',
        'monthly_revenue_band': 'UGX 3M - 6M',
        'employee_count': 3,
        'is_demo_account': False,
        'notes': 'Initial registration',
    }
    payload.update(overrides)
    return BusinessRegistration.objects.create(**payload)


class BusinessRegistrationLedgerTests(TestCase):
    def test_create_and_update_append_linked_blocks(self):
        business = create_business()
        business.notes = 'Updated after onsite verification'
        business.save()

        blocks = list(BusinessRegistrationLedgerBlock.objects.order_by('chain_index'))

        self.assertEqual(2, len(blocks))
        self.assertEqual(GENESIS_BLOCK_HASH, blocks[0].previous_hash)
        self.assertEqual(blocks[0].block_hash, blocks[1].previous_hash)
        self.assertEqual(BusinessRegistrationLedgerBlock.Operation.CREATE, blocks[0].operation)
        self.assertEqual(BusinessRegistrationLedgerBlock.Operation.UPDATE, blocks[1].operation)

        chain_state = BusinessRegistrationChainState.objects.get(singleton_id=1)
        self.assertEqual(2, chain_state.latest_index)
        self.assertEqual(blocks[-1].block_hash, chain_state.latest_hash)
        self.assertTrue(BusinessRegistrationLedgerBlock.verify_chain()['is_valid'])
        self.assertEqual(
            2,
            AppSecurityLedgerBlock.objects.filter(
                domain=AppSecurityLedgerBlock.Domain.BUSINESS_REGISTRATION,
            ).count(),
        )

    def test_noop_update_does_not_append_block(self):
        business = create_business()

        business.save()

        self.assertEqual(1, BusinessRegistrationLedgerBlock.objects.count())
        self.assertTrue(BusinessRegistrationLedgerBlock.verify_chain()['is_valid'])
        self.assertEqual(
            1,
            AppSecurityLedgerBlock.objects.filter(
                domain=AppSecurityLedgerBlock.Domain.BUSINESS_REGISTRATION,
            ).count(),
        )

    def test_verification_detects_block_tampering(self):
        create_business()
        block = BusinessRegistrationLedgerBlock.objects.get(chain_index=1)

        BusinessRegistrationLedgerBlock.objects.filter(pk=block.pk).update(
            payload={**block.payload, 'notes': 'Tampered outside the model save path'},
        )

        verification = BusinessRegistrationLedgerBlock.verify_chain()

        self.assertFalse(verification['is_valid'])
        self.assertEqual(1, verification['failed_block'])


@override_settings(LEDGER_CHAIN_SECRET='test-ledger-secret')
class AppSecurityLedgerTests(TestCase):
    def test_user_profile_and_business_events_append_signed_blocks(self):
        user = get_user_model().objects.create_user(username='guardian', password='SecurePass123!')
        profile = DemoAccessProfile(
            user=user,
            display_name='Guardian User',
            role=DemoAccessProfile.Role.FIELD_AGENT,
            requires_tin=False,
            notes='Security observer',
        )
        profile.save(ledger_actor='guardian')
        create_business()

        blocks = list(AppSecurityLedgerBlock.objects.order_by('chain_index'))

        self.assertEqual(3, len(blocks))
        self.assertEqual(GENESIS_BLOCK_HASH, blocks[0].previous_hash)
        self.assertEqual(blocks[0].block_hash, blocks[1].previous_hash)
        self.assertEqual(blocks[1].block_hash, blocks[2].previous_hash)
        self.assertEqual(AppSecurityLedgerBlock.Domain.USER_ACCOUNT, blocks[0].domain)
        self.assertEqual(AppSecurityLedgerBlock.Domain.DEMO_ACCESS_PROFILE, blocks[1].domain)
        self.assertEqual(AppSecurityLedgerBlock.Domain.BUSINESS_REGISTRATION, blocks[2].domain)

        chain_state = AppSecurityChainState.objects.get(singleton_id=1)
        self.assertEqual(3, chain_state.latest_index)
        self.assertEqual(blocks[-1].block_hash, chain_state.latest_hash)
        self.assertEqual(blocks[-1].signature, chain_state.latest_signature)
        self.assertTrue(AppSecurityLedgerBlock.verify_chain()['is_valid'])

    def test_verification_detects_signature_tampering(self):
        get_user_model().objects.create_user(username='guardian', password='SecurePass123!')
        block = AppSecurityLedgerBlock.objects.get(chain_index=1)

        AppSecurityLedgerBlock.objects.filter(pk=block.pk).update(signature='0' * 64)

        verification = AppSecurityLedgerBlock.verify_chain()

        self.assertFalse(verification['is_valid'])
        self.assertEqual(1, verification['failed_block'])


@override_settings(LEDGER_CHAIN_SECRET='test-ledger-secret')
class AuthSecurityEventTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='auditor', password='AuditPass123!')

    def test_login_failure_and_success_are_logged(self):
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'username': 'auditor', 'password': 'wrong-pass'}),
            content_type='application/json',
        )
        self.assertEqual(401, response.status_code)

        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'username': 'auditor', 'password': 'AuditPass123!'}),
            content_type='application/json',
        )
        self.assertEqual(200, response.status_code)

        auth_events = list(
            AppSecurityLedgerBlock.objects.filter(domain=AppSecurityLedgerBlock.Domain.AUTH).order_by('chain_index')
        )

        self.assertEqual(['login_failure', 'login_success'], [event.event_type for event in auth_events])

    def test_registration_and_logout_are_logged(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps(
                {
                    'display_name': 'Field Agent',
                    'username': 'field.guard',
                    'password': 'FieldPass123!',
                    'confirm_password': 'FieldPass123!',
                }
            ),
            content_type='application/json',
        )
        self.assertEqual(201, response.status_code)

        response = self.client.post(reverse('logout_view'))
        self.assertEqual(200, response.status_code)

        auth_events = list(
            AppSecurityLedgerBlock.objects.filter(domain=AppSecurityLedgerBlock.Domain.AUTH).order_by('chain_index')
        )

        self.assertEqual(['register_success', 'logout'], [event.event_type for event in auth_events])


@override_settings(LEDGER_CHAIN_SECRET='test-ledger-secret')
class LedgerIntegrityEndpointTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='auditor', password='AuditPass123!')

    def test_endpoint_requires_authentication(self):
        response = self.client.get(reverse('ledger_integrity'))

        self.assertEqual(401, response.status_code)

    def test_endpoint_returns_verification_result(self):
        create_business()
        self.client.force_login(self.user)

        response = self.client.get(reverse('ledger_integrity'))
        payload = response.json()

        self.assertEqual(200, response.status_code)
        self.assertEqual('tamper-evident hash chains with HMAC signing', payload['protection_model'])
        self.assertTrue(payload['is_valid'])
        self.assertTrue(payload['ledger']['is_valid'])
        self.assertTrue(payload['ledgers']['business_registrations']['is_valid'])
        self.assertTrue(payload['ledgers']['app_security']['is_valid'])
        self.assertEqual('hmac-sha256', payload['ledgers']['app_security']['signature_algorithm'])