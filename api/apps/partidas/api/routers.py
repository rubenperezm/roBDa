from rest_framework.routers import DefaultRouter

from apps.partidas.api.views.repasos_viewsets import PartidaRepasoViewSet
from apps.partidas.api.views.user_comps_viewsets import PartidaEventoViewSet
from apps.partidas.api.views.duelos_viewsets import PartidaDueloViewSet


router = DefaultRouter()

router.register('repaso', PartidaRepasoViewSet, basename="partidas-repaso")
router.register('evento', PartidaEventoViewSet, basename="partidas-evento")
router.register('duelo', PartidaDueloViewSet, basename="partidas-duelo")

urlpatterns = router.urls