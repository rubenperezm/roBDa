from rest_framework.viewsets import ModelViewSet
from apps.preguntas.models import Tema, Imagen
from django_filters.rest_framework.backends import DjangoFilterBackend
from django_filters.rest_framework.filterset import FilterSet
from django_filters import CharFilter
from rest_framework.response import Response
from rest_framework import status
from apps.base.permissions import esProfeOSoloLectura
from apps.preguntas.api.serializers.general_serializers import TemaSerializer, ImagenSerializer

class ImagenFilter(FilterSet):
    nombre = CharFilter(field_name='nombre', lookup_expr='contains')
    tema = CharFilter(field_name='tema__nombre')

    class Meta:
        model = Imagen
        fields = ['nombre', 'tema']


class TemaViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = TemaSerializer
    model = Tema

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()
    
    def list(self, request):
        topics = self.filter_queryset(self.get_queryset())

        if request.query_params.get('page', None):
            page = self.paginate_queryset(topics)
            if page is not None:
                topics_serial = self.serializer_class(page, many = True)
                return self.get_paginated_response(topics_serial.data)
        topics_serial = self.serializer_class(topics, many = True)
        return Response(topics_serial.data)

class ImagenViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]
    serializer_class = ImagenSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImagenFilter
    model = Imagen

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def update(self, request, pk=None):
        image = self.get_queryset(pk)
        if image is None:
            return Response({'detail': 'No existe la imagen'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['path'] = image.path
        serializer = self.serializer_class(image, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)