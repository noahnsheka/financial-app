from django.urls import path

from .views import (
    business_credit_draft,
    credit_registration,
    business_detail,
    business_collection,
    business_documents,
    business_stock_entries,
    demo_accounts,
    health_check,
    ledger_integrity,
    login_view,
    logout_view,
    me_view,
    platform_bootstrap,
    register_view,
)


urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('platform/bootstrap/', platform_bootstrap, name='platform_bootstrap'),
    path('businesses/', business_collection, name='business_collection'),
    path('businesses/<int:business_id>/', business_detail, name='business_detail'),
    path('businesses/<int:business_id>/stock-entries/', business_stock_entries, name='business_stock_entries'),
    path('businesses/<int:business_id>/documents/', business_documents, name='business_documents'),
    path('businesses/<int:business_id>/credit-draft/', business_credit_draft, name='business_credit_draft'),
    path('businesses/<int:business_id>/credit-registration/', credit_registration, name='credit_registration'),
    path('ledger/integrity/', ledger_integrity, name='ledger_integrity'),
    path('demo-accounts/', demo_accounts, name='demo_accounts'),
    path('auth/login/', login_view, name='login_view'),
    path('auth/register/', register_view, name='register_view'),
    path('auth/logout/', logout_view, name='logout_view'),
    path('auth/me/', me_view, name='me_view'),
]