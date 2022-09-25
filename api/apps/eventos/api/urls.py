from django.urls import path, include

from apps.eventos.api.views.eventos_viewsets import terminar_evento

urlpatterns = [
    path('eventos/', include('apps.eventos.api.routers')),
    path('terminar/<int:pk>/', terminar_evento.as_view()),
]