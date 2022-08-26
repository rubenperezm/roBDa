from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from apps.base.models import Tema
from apps.preguntas.api.serializers.general_serializers import TemaSerializer

class TemaViewSet(ModelViewSet):
    permission_classes = [IsAdminUser,]
    permission_class_per_method = {
        "list": [IsAuthenticated],
        #TODO considerar si es necesario el metodo get
        "get": [IsAuthenticated],
    }
    serializer_class = TemaSerializer
    model = Tema

    queryset = model.objects.all()
