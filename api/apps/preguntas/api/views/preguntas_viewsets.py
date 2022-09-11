from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from random import choice
from datetime import datetime
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.base.models import Evento, Imagen, Pregunta, Tema
from apps.base.permissions import esProfeOSoloLectura, isNotStaff
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaListSerializer, PreguntaResueltaSerializer, PreguntaRetrieveSerializer, PreguntaSerializer

# TODO cambiar para que no haga falta usar permission_classes (usar ifs en los metodos)
class PreguntaViewSet(ModelViewSet):
    #permission_classes = [preguntaPermission, IsAuthenticated]
    serializer_class = PreguntaSerializer
    serializer_class_list = PreguntaListSerializer
    serializer_class_retrieve = PreguntaRetrieveSerializer
    model = Pregunta

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.exclude(estado=3)
        return self.model.objects.filter(id=pk).exclude(estado=3).first()

    def list(self, request):
        # TODO listado personalizado segun parametros??? (para los profesores)
        if request.user.is_staff:
            preguntas = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(preguntas)
            if page is not None:
                preguntas_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(preguntas_serial.data)
            preguntas_serial = self.serializer_class_list(preguntas, many = True)
            return Response(preguntas_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)
    
    def retrieve(self, request, pk=None):
        if request.user.is_staff:
            pregunta = self.get_object()
            pregunta_serializer = self.serializer_class_retrieve(pregunta)
            return Response(pregunta_serializer.data)
        return Response({"error": "No puede ver esta pregunta."}, status=status.HTTP_403_FORBIDDEN)

        
    def create(self, request):
        pregunta = None
        event = get_object_or_404(Evento, pk=request.data.get('evento', None))
        if event:
            pregunta = Pregunta.objects.filter(creador=request.user.id, evento=event.id)
        if request.user.is_staff or ((datetime.now().timestamp() <= event.finFase1.timestamp()) and not pregunta):
            data = request.data.copy()
            data["creador"] = request.user.id  
            data["imagen"] = request.data.get('imagen', None)
            if request.data.get('evento'):
                data["idioma"] = event.idioma
                data["tema"] = event.tema
            else:
                data["idioma"] = request.data.get('idioma', None)
                data["tema"] = request.data.get('tema', None)
            print(data)
            preg_serial = self.serializer_class(data=data)
            if preg_serial.is_valid():
                preg_serial.save()
                return Response({'detail': preg_serial.data}, status=status.HTTP_201_CREATED)
            return Response({'error': preg_serial.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': "Sólo puede crearse una pregunta por evento, y debe de hacerse en la primera fase"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk=None):
        if request.user.is_staff:
            pregunta = self.get_queryset().filter(id=pk).first()       
            if pregunta:
                pregunta.estado = 3
                pregunta.save()
                return Response({'message':'Pregunta eliminada correctamente'}, status=status.HTTP_200_OK)
            return Response({'error':'No existe pregunta con estos datos'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los alumnos no pueden borrar preguntas."}, status=status.HTTP_403_FORBIDDEN)