from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import rechazar, aceptar
from apps.partidas.api.views.repasos_viewsets import valorar_pregunta

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    path('rechazar-duelo/<int:pk>/', rechazar),
    path('aceptar-duelo/<int:pk>/', aceptar),
    path('valorar/<int:pk>/', valorar_pregunta),
]