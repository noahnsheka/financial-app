from django.contrib import admin

from .models import (
    AppSecurityChainState,
    AppSecurityLedgerBlock,
    BusinessRegistration,
    BusinessRegistrationChainState,
    BusinessRegistrationLedgerBlock,
    DemoAccessProfile,
)


@admin.register(BusinessRegistration)
class BusinessRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'business_name',
        'owner_name',
        'account_user',
        'district',
        'sector',
        'tin_number',
        'is_demo_account',
        'tax_lookup_status',
        'created_at',
    )
    list_filter = ('district', 'sector', 'is_demo_account', 'tax_lookup_status')
    search_fields = ('business_name', 'owner_name', 'account_user__username', 'tin_number', 'phone_number', 'mobile_money_number')


@admin.register(BusinessRegistrationLedgerBlock)
class BusinessRegistrationLedgerBlockAdmin(admin.ModelAdmin):
    list_display = ('chain_index', 'business', 'operation', 'created_at')
    list_filter = ('operation', 'created_at')
    ordering = ('-chain_index',)
    readonly_fields = ('business', 'chain_index', 'operation', 'previous_hash', 'block_hash', 'payload', 'created_at')
    search_fields = ('business__business_name', 'business__owner_name', 'block_hash', 'previous_hash')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(BusinessRegistrationChainState)
class BusinessRegistrationChainStateAdmin(admin.ModelAdmin):
    list_display = ('singleton_id', 'latest_index', 'latest_hash', 'updated_at')
    readonly_fields = ('singleton_id', 'latest_index', 'latest_hash', 'updated_at')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AppSecurityLedgerBlock)
class AppSecurityLedgerBlockAdmin(admin.ModelAdmin):
    list_display = ('chain_index', 'domain', 'event_type', 'entity_key', 'actor_identifier', 'recorded_at')
    list_filter = ('domain', 'event_type', 'recorded_at')
    ordering = ('-chain_index',)
    readonly_fields = (
        'chain_index',
        'domain',
        'event_type',
        'entity_key',
        'actor_identifier',
        'previous_hash',
        'block_hash',
        'signature',
        'payload',
        'recorded_at',
        'created_at',
    )
    search_fields = ('entity_key', 'actor_identifier', 'block_hash', 'signature')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AppSecurityChainState)
class AppSecurityChainStateAdmin(admin.ModelAdmin):
    list_display = ('singleton_id', 'latest_index', 'latest_hash', 'latest_signature', 'updated_at')
    readonly_fields = ('singleton_id', 'latest_index', 'latest_hash', 'latest_signature', 'updated_at')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DemoAccessProfile)
class DemoAccessProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'role', 'requires_tin')
    list_filter = ('role', 'requires_tin')
    search_fields = ('display_name', 'user__username')