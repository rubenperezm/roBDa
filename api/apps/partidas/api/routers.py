from rest_framework.routers import DefaultRouter

from apps.partidas.api.views.partidas_viewsets import PartidaRepasoViewSet
#from apps.partidas.api.views.partidas_viewsets import PartidaAPIView, LogsAPIView
# TODO duelos, repasos, user-comps, ...

router = DefaultRouter()

router.register('repaso', PartidaRepasoViewSet, basename="partidas-repaso")
#router.register('evento', PartidaEventoViewSet, basename="partidas-evento")
#router.register('duelo', PartidaDueloViewSet, basename="partidas-duelo")

#router.register('', PartidaRepasoViewSet, basename="partidas-repaso")
urlpatterns = router.urls