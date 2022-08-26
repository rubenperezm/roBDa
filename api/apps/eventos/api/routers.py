from rest_framework.routers import DefaultRouter

from apps.eventos.api.views.eventos_viewsets import EventoViewSet

router = DefaultRouter()

router.register('', EventoViewSet, basename="eventos")
#router.register('mejoresValoraciones',MeasureUnitViewSet,basename = 'measure_valoraciones')
urlpatterns = router.urls