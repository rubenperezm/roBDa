from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from random import choice
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer

from apps.base.models import Evento, Imagen, Pregunta, Tema
from apps.base.permissions import esProfeOSoloLectura, isNotStaff, preguntaPermission
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer

class PreguntaViewSet(ModelViewSet):
    permission_classes = [preguntaPermission, IsAuthenticated]
    serializer_class = PreguntaSerializer
    model = Pregunta

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.exclude(estado=3)
        return self.model.objects.filter(id=pk).exclude(estado=3).first()
    '''
    def list(self, request):
        # TODO listado personalizado segun parametros??? (para los profesores)
        return self.queryset
    '''

    def create(self, request):
        data = request.data.copy()
        data["creador"] = request.user.id
        # TODO en frontend mandar evento XOR tema (segun sea alumno o profesor respectivamente)   
        if request.data.get('evento'):
            event = Evento.objects.get(pk=request.data.get('evento'))
            data["idioma"] = event.idioma
            data["tema"] = event.tema
        else:
            if request.data.get('idioma'):
                data["idioma"] = request.data.idioma
            if request.data.get('tema'):
                data["tema"] = request.data.tema
        preg_serial = self.serializer_class(data=data)
        if preg_serial.is_valid():
            preg_serial.save()
            return Response({'detail': preg_serial.data}, status=status.HTTP_201_CREATED)
        return Response({'error': preg_serial.errors}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        pregunta = self.get_queryset().filter(id=pk).first()       
        if pregunta:
            pregunta.estado = 3
            pregunta.save()
            return Response({'message':'Pregunta eliminada correctamente'}, status=status.HTTP_200_OK)
        return Response({'error':'No existe pregunta con estos datos'}, status=status.HTTP_400_BAD_REQUEST)
