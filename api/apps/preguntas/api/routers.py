from rest_framework.routers import DefaultRouter
from apps.preguntas.api.views.preguntas_viewsets import PreguntaViewSet
from apps.preguntas.api.views.general_viewsets import *

router = DefaultRouter()

router.register('preguntas', PreguntaViewSet, basename="preguntas")
router.register('temas', TemaViewSet, basename="temas")
router.register('imagenes', ImagenViewSet, basename="imagenes")

urlpatterns = router.urls