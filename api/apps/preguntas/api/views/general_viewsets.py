from rest_framework.viewsets import ModelViewSet
from apps.base.models import Tema, Imagen
from apps.base.permissions import esProfeOSoloLectura
from apps.preguntas.api.serializers.general_serializers import TemaSerializer, ImagenSerializer

class TemaViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = TemaSerializer
    model = Tema

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

class ImagenViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = ImagenSerializer
    model = Imagen

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()