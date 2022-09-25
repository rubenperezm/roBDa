from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import finalizar, rechazar, retar, aceptar

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    path('rechazar-duelo/<int:pk>/', rechazar),
    path('aceptar-duelo/<int:pk>/', aceptar),
    path('finalizar-duelo/<int:pk>/', finalizar),
    path('retar-duelo/<int:pk>/', retar)
]