from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import rechazar, aceptar

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    path('rechazar-duelo/<int:pk>/', rechazar),
    path('aceptar-duelo/<int:pk>/', aceptar),
]