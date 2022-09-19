from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import finalizar, rechazar, retar

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    path('rechazar-duelo/<int:pk>', rechazar),
    path('finalizar-duelo/<int:pk>', finalizar),
    path('retar-duelo/<int:pk>', retar)
]