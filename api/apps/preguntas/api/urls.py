from django.urls import path, include

from apps.preguntas.api.views.preguntas_viewsets import reportar


urlpatterns = [
    path('preguntas/', include('apps.preguntas.api.routers')),
    path('reportar/<int:pk>', reportar)
]
