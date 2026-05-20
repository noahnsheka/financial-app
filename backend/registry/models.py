from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


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

    def save(self, *args, **kwargs):
        self.tin_number = (self.tin_number or '').strip() or None

        if self.is_demo_account:
            self.tax_lookup_status = self.TaxLookupStatus.DEMO
        elif self.tin_number:
            self.tax_lookup_status = self.TaxLookupStatus.READY
        else:
            self.tax_lookup_status = self.TaxLookupStatus.NOT_PROVIDED

        self.full_clean()
        return super().save(*args, **kwargs)

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