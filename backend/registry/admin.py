from django.contrib import admin

from .models import BusinessRegistration, DemoAccessProfile


@admin.register(BusinessRegistration)
class BusinessRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'business_name',
        'owner_name',
        'district',
        'sector',
        'tin_number',
        'is_demo_account',
        'tax_lookup_status',
        'created_at',
    )
    list_filter = ('district', 'sector', 'is_demo_account', 'tax_lookup_status')
    search_fields = ('business_name', 'owner_name', 'tin_number', 'phone_number', 'mobile_money_number')


@admin.register(DemoAccessProfile)
class DemoAccessProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'role', 'requires_tin')
    list_filter = ('role', 'requires_tin')
    search_fields = ('display_name', 'user__username')