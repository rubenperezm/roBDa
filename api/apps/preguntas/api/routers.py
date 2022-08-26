from rest_framework.routers import DefaultRouter

from apps.preguntas.api.views.general_viewsets import TemaViewSet

router = DefaultRouter()

router.register('temas', TemaViewSet, basename="temas")
#TODO imagenes, preguntas, etc.
urlpatterns = router.urls