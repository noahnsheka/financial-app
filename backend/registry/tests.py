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
        'inventory_value_estimate': '1850000.00',
        'average_monthly_profit': '620000.00',
        'average_monthly_mobile_money': '2400000.00',
        'receipt_count': 9,
        'receipt_value_total': '1800000.00',
        'employee_count': 3,
        'is_demo_account': False,
        'notes': 'Initial registration',
    }
    payload.update(overrides)
    return BusinessRegistration.objects.create(**payload)


def create_profile(user, role=DemoAccessProfile.Role.FIELD_AGENT, **overrides) -> DemoAccessProfile:
    payload = {
        'display_name': user.username.replace('.', ' ').title(),
        'role': role,
        'requires_tin': role != DemoAccessProfile.Role.BUSINESS_OWNER,
        'notes': '',
    }
    payload.update(overrides)
    profile = DemoAccessProfile(user=user, **payload)
    profile.save(ledger_actor=user.username)
    return profile


def owner_registration_payload(**overrides) -> dict:
    payload = {
        'display_name': 'Paul Ssenfuka',
        'username': 'paul.owner',
        'password': 'OwnerPass123!',
        'confirm_password': 'OwnerPass123!',
        'business_name': 'Wakiso Home Goods',
        'phone_number': '+256700111333',
        'mobile_money_number': '+256700111333',
        'tin_number': '12345678',
        'district': 'Wakiso',
        'sector': 'Retail',
        'location_description': 'Trading centre next to the taxi stage',
        'stock_focus': 'Home goods and groceries',
        'monthly_revenue_band': 'UGX 3M - 6M',
        'inventory_value_estimate': '2200000.00',
        'average_monthly_profit': '780000.00',
        'average_monthly_mobile_money': '2600000.00',
        'receipt_count': 12,
        'receipt_value_total': '2100000.00',
        'employee_count': 3,
        'notes': 'Owner self-registration',
    }
    payload.update(overrides)
    return payload


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

    def test_credit_readiness_responds_to_consistent_financial_evidence(self):
        business = create_business()

        self.assertGreaterEqual(business.profile_score, 75)
        self.assertGreaterEqual(business.consistency_score, 60)
        self.assertGreaterEqual(business.receipt_trust_score, 40)
        self.assertTrue(business.is_credit_ready)
        self.assertGreaterEqual(business.credit_score, 60)


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
            data=json.dumps(owner_registration_payload(username='field.guard', display_name='Field Guard')),
            content_type='application/json',
        )
        self.assertEqual(201, response.status_code)

        user = get_user_model().objects.get(username='field.guard')
        self.assertEqual(DemoAccessProfile.Role.BUSINESS_OWNER, user.demo_profile.role)
        self.assertTrue(BusinessRegistration.objects.filter(account_user=user).exists())

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


@override_settings(LEDGER_CHAIN_SECRET='test-ledger-secret')
class PlatformBootstrapTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_bootstrap_aggregates_database_backed_platform_data(self):
        create_business(
            workspace_payload={
                'stock_entries': [
                    {
                        'id': 'stock-001',
                        'date': '2026-05-21',
                        'item_name': 'Sugar',
                        'category': 'Retail',
                        'unit': 'bags',
                        'on_hand': 2,
                        'received': 0,
                        'sold': 4,
                        'reorder_level': 6,
                        'selling_price': '3500.00',
                    }
                ],
                'monthly_sales': [
                    {
                        'id': 'month-001',
                        'month_start': '2026-05-01',
                        'label': 'May',
                        'revenue': '420000.00',
                        'expenses': '260000.00',
                        'orders': 48,
                        'mobile_money': '280000.00',
                        'cash_sales': '140000.00',
                        'supplier_payments': '210000.00',
                        'readiness_score': 74,
                    }
                ],
                'documents': [],
                'credit_draft': {},
            }
        )

        response = self.client.get(reverse('platform_bootstrap'))

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.assertEqual('1', payload['metrics'][0]['value'])
        self.assertEqual(['May'], payload['collections']['labels'])
        self.assertEqual([0.3], payload['collections']['mobileMoney'])
        self.assertEqual([74], payload['scoreTrend']['values'])
        self.assertEqual('LedgerLift Foods', payload['stockAlerts'][0]['business'])
        self.assertIn('districts', payload['registrationForm'])
        self.assertIn('scoreBreakdown', payload)
        self.assertIn('loanPrograms', payload)


@override_settings(LEDGER_CHAIN_SECRET='test-ledger-secret')
class BusinessOwnerAccessTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.owner_user = get_user_model().objects.create_user(username='owner.user', password='OwnerPass123!')
        create_profile(
            self.owner_user,
            role=DemoAccessProfile.Role.BUSINESS_OWNER,
            display_name='Owner User',
            requires_tin=False,
            notes='Owner dashboard access',
        )
        self.owner_business = create_business(
            business_name='Owner Business',
            owner_name='Owner User',
            account_user=self.owner_user,
            notes='Owner-linked business',
        )
        self.other_business = create_business(
            business_name='Other Business',
            owner_name='Other User',
            phone_number='+256700111444',
            mobile_money_number='+256700111444',
            tin_number='87654321',
            notes='Not linked to the owner account',
        )

    def test_registration_creates_owner_profile_and_linked_business(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps(owner_registration_payload(username='new.owner')),
            content_type='application/json',
        )

        self.assertEqual(201, response.status_code)
        payload = response.json()

        user = get_user_model().objects.get(username='new.owner')
        profile = user.demo_profile
        business = BusinessRegistration.objects.get(account_user=user)

        self.assertEqual(DemoAccessProfile.Role.BUSINESS_OWNER, profile.role)
        self.assertEqual('Wakiso Home Goods', business.business_name)
        self.assertIsNotNone(payload['user']['business'])
        self.assertEqual(business.id, payload['user']['business']['id'])

    def test_owner_only_sees_assigned_business(self):
        self.client.force_login(self.owner_user)

        response = self.client.get(reverse('business_collection'))

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.assertEqual('owned', payload['scope'])
        self.assertEqual(1, payload['count'])
        self.assertEqual(self.owner_business.id, payload['results'][0]['id'])

    def test_owner_business_list_includes_workspace_payload(self):
        self.client.force_login(self.owner_user)

        response = self.client.get(reverse('business_collection'))

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.assertIn('workspace', payload['results'][0])
        self.assertIn('stock_entries', payload['results'][0]['workspace'])
        self.assertIn('monthly_sales', payload['results'][0]['workspace'])
        self.assertIn('documents', payload['results'][0]['workspace'])
        self.assertIn('credit_draft', payload['results'][0]['workspace'])

    def test_owner_can_patch_assigned_business(self):
        self.client.force_login(self.owner_user)

        response = self.client.patch(
            reverse('business_detail', args=[self.owner_business.id]),
            data=json.dumps(
                {
                    'business_name': 'Owner Business Updated',
                    'phone_number': '+256700999111',
                    'monthly_revenue_band': 'UGX 6M - 10M',
                    'employee_count': 5,
                    'notes': 'Updated from owner workspace',
                }
            ),
            content_type='application/json',
        )

        self.assertEqual(200, response.status_code)
        self.owner_business.refresh_from_db()

        self.assertEqual('Owner Business Updated', self.owner_business.business_name)
        self.assertEqual('+256700999111', self.owner_business.phone_number)
        self.assertEqual('UGX 6M - 10M', self.owner_business.monthly_revenue_band)
        self.assertEqual(5, self.owner_business.employee_count)
        self.assertEqual('Updated from owner workspace', self.owner_business.notes)

    def test_owner_cannot_patch_other_business(self):
        self.client.force_login(self.owner_user)

        response = self.client.patch(
            reverse('business_detail', args=[self.other_business.id]),
            data=json.dumps({'notes': 'Tamper attempt'}),
            content_type='application/json',
        )

        self.assertEqual(403, response.status_code)
        self.other_business.refresh_from_db()
        self.assertEqual('Not linked to the owner account', self.other_business.notes)

    def test_owner_can_submit_credit_registration_with_nin(self):
        self.client.force_login(self.owner_user)

        response = self.client.post(
            reverse('credit_registration', args=[self.owner_business.id]),
            data=json.dumps({'nin_number': 'CM1234567890AB'}),
            content_type='application/json',
        )

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.owner_business.refresh_from_db()
        self.assertEqual('CM1234567890AB', self.owner_business.nin_number)
        self.assertEqual(BusinessRegistration.NINVerificationStatus.MANUAL_REVIEW, self.owner_business.nin_verification_status)
        self.assertEqual(BusinessRegistration.CreditRegistrationStatus.SUBMITTED, self.owner_business.credit_registration_status)
        self.assertTrue(payload['business']['credit_registration_reference'])

    def test_owner_can_add_stock_entry_to_workspace(self):
        self.client.force_login(self.owner_user)

        response = self.client.post(
            reverse('business_stock_entries', args=[self.owner_business.id]),
            data=json.dumps(
                {
                    'date': '2026-05-21',
                    'item_name': 'Soap',
                    'category': 'Retail',
                    'unit': 'bars',
                    'on_hand': 12,
                    'received': 5,
                    'sold': 4,
                    'reorder_level': 6,
                    'selling_price': '5000.00',
                }
            ),
            content_type='application/json',
        )

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.owner_business.refresh_from_db()
        workspace = self.owner_business.normalized_workspace_payload

        self.assertEqual('Stock entry saved.', payload['message'])
        self.assertEqual('Soap', workspace['stock_entries'][0]['item_name'])
        self.assertEqual(1, len(workspace['monthly_sales']))
        self.assertEqual(4, workspace['monthly_sales'][0]['orders'])
        self.assertEqual('Soap', payload['business']['workspace']['stock_entries'][0]['item_name'])

    def test_owner_can_add_document_to_workspace(self):
        self.client.force_login(self.owner_user)

        response = self.client.post(
            reverse('business_documents', args=[self.owner_business.id]),
            data=json.dumps(
                {
                    'name': 'Trading licence',
                    'type': 'Compliance',
                    'reference': 'LIC-2026-22',
                    'due_date': '2026-06-30',
                    'status': 'Ready',
                }
            ),
            content_type='application/json',
        )

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.owner_business.refresh_from_db()
        workspace = self.owner_business.normalized_workspace_payload

        self.assertEqual('Document saved.', payload['message'])
        self.assertEqual('Trading licence', workspace['documents'][0]['name'])
        self.assertEqual('Ready', workspace['documents'][0]['status'])
        self.assertEqual('Trading licence', payload['business']['workspace']['documents'][0]['name'])

    def test_owner_can_update_credit_draft(self):
        self.client.force_login(self.owner_user)

        response = self.client.patch(
            reverse('business_credit_draft', args=[self.owner_business.id]),
            data=json.dumps(
                {
                    'requested_amount': '1500000.00',
                    'loan_purpose': 'Increase household stock depth',
                    'repayment_window': '6 months',
                    'bookkeeping_score': 82,
                    'supplier_score': 77,
                    'collateral_notes': 'Inventory and mobile money history available.',
                }
            ),
            content_type='application/json',
        )

        self.assertEqual(200, response.status_code)
        payload = response.json()

        self.owner_business.refresh_from_db()
        workspace = self.owner_business.normalized_workspace_payload

        self.assertEqual('Credit draft updated.', payload['message'])
        self.assertEqual('1500000.00', workspace['credit_draft']['requested_amount'])
        self.assertEqual('Database-backed draft', workspace['credit_draft']['registration_status'])
        self.assertEqual(82, workspace['credit_draft']['bookkeeping_score'])
        self.assertEqual('Increase household stock depth', payload['business']['workspace']['credit_draft']['loan_purpose'])