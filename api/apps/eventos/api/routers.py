from rest_framework.routers import DefaultRouter

from apps.eventos.api.views.eventos_viewsets import EventoViewSet

router = DefaultRouter()

router.register('', EventoViewSet, basename="eventos")

urlpatterns = router.urls