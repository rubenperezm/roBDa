from django.urls import path, include


urlpatterns = [
    path('preguntas/', include('apps.preguntas.api.routers')),
]
