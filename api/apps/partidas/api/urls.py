from django.urls import path, include
from apps.partidas.api.views.duelos_viewsets import decidir, getPreguntas
from apps.partidas.api.views.repasos_viewsets import valorar_pregunta
from apps.partidas.api.views.user_comps_viewsets import valorar

urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    # path('rechazar-duelo/<int:pk>/', rechazar),
    path('partidas/duelo/decidir/<int:pk>/', decidir),
    path('valorar/<int:pk>/', valorar_pregunta),
    path('partidas/evento/valorar/<int:pk>/', valorar),
    path('partidas/duelo/preguntas/<int:pk>/', getPreguntas)
]