from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import decidir, getPreguntas
from apps.partidas.api.views.repasos_viewsets import valorar_pregunta

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    # path('rechazar-duelo/<int:pk>/', rechazar),
    path('partidas/duelo/decidir/<int:pk>/', decidir),
    path('valorar/<int:pk>/', valorar_pregunta),
    path('partidas/duelo/preguntas/<int:pk>/', getPreguntas)
]