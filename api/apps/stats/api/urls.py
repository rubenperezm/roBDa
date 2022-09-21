from django.urls import path

from apps.stats.api.views.stats_api_view import estadisticas


urlpatterns = [
    path(r'', estadisticas)
]
