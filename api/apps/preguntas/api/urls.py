from django.urls import path, include

from apps.preguntas.api.views.preguntas_viewsets import reportar, cambiar_estado_report


urlpatterns = [
    path('', include('apps.preguntas.api.routers')),
    path('reportar/', reportar.as_view()),
    path('decidir-report/<int:pk>/', cambiar_estado_report),
]
