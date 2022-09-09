from django.urls import path, include


urlpatterns = [
    path('partidas/', include('apps.partidas.api.routers')),
    #path('duelos', ...) #Duelo viewset
    #path('eventos', ...) #User-comp viewset
]