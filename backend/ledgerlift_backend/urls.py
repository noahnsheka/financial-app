from django.contrib import admin
from django.urls import include, path

from registry.views import service_root

urlpatterns = [
    path('', service_root, name='service_root'),
    path('admin/', admin.site.urls),
    path('api/', include('registry.urls')),
]