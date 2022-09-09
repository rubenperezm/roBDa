"""robda URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from apps.users.api.api import *
from django.views.static import serve
from django.conf import settings

from apps.users.views import *
from apps.eventos.api.routers import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name = 'logout'),
    #path('login/', Login.as_view(), name = 'login'),
    path('register/', Register.as_view(), name = 'register'),
    path('users/', UserAPIView.as_view(), name = 'profile'),
    path('users/set-password/', set_password, name = 'change_password'),
    path('eventos/', include('apps.eventos.api.routers')),
    path('preguntas/', include('apps.preguntas.api.urls')),
    # TODO comprobar si es necesario un router o url (tipo /preguntas/aleatoria)
    path('partidas/', include('apps.partidas.api.urls')),
    #TODO path('stats/', include('apps.stats.api.routers')),
]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    })
]