from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from apps.base.models import Evento
from apps.base.permissions import esProfeOSoloLectura
from apps.eventos.api.serializers.eventos_serializers import EventoSerializer

class EventoViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = EventoSerializer
    model = Evento

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()