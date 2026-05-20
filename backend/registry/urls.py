from django.urls import path

from .views import business_collection, demo_accounts, health_check, login_view, logout_view, me_view, register_view


urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('businesses/', business_collection, name='business_collection'),
    path('demo-accounts/', demo_accounts, name='demo_accounts'),
    path('auth/login/', login_view, name='login_view'),
    path('auth/register/', register_view, name='register_view'),
    path('auth/logout/', logout_view, name='logout_view'),
    path('auth/me/', me_view, name='me_view'),
]