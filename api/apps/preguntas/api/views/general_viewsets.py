from rest_framework.viewsets import ModelViewSet

from apps.base.models import Tema, Imagen
from apps.base.permissions import esProfeOSoloLectura
from apps.preguntas.api.serializers.general_serializers import TemaSerializer, ImagenSerializer

class TemaViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = TemaSerializer
    model = Tema

    queryset = model.objects.all()

class ImagenViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = ImagenSerializer
    model = Imagen

    queryset = model.objects.all()