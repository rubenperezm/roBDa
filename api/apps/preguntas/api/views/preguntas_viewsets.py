from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from random import choice

from apps.base.models import Evento, Pregunta, Tema
from apps.base.permissions import esProfeOSoloLectura, preguntaPermission
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer

class PreguntaViewSet(ModelViewSet):
    permission_classes = [preguntaPermission, IsAuthenticated]
    serializer_class = PreguntaSerializer
    model = Pregunta
    queryset = model.objects.exclude(estado=3)

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
        preg_serial = self.serializer_class(data=data)
        if preg_serial.is_valid():
            preg_serial.save()
            return Response({'detail': preg_serial.data}, status=status.HTTP_201_CREATED)
        return Response({'error': preg_serial.errors}, status=status.HTTP_400_BAD_REQUEST)

class PreguntaAleatoria(APIView):
    permission_classes = [esProfeOSoloLectura, IsAuthenticated]
    serializer_class = PreguntaSerializer
    model = Pregunta
    queryset = model.objects.exclude(estado=3)

    def get(self, request):
        # TODO cuando se haga un cuestionario, no repetir preguntas en un intervalo de minimo 10
        # y asi no habra cuestionarios con preguntas dobles (controlado desde frontend)
        # TODO en frontend permitir o todos los temas o uno solo (id o None)
        filters = {}
        evento = False

        if request.data.get('evento'):
            filters["evento"] = request.data.get('evento')
            evento = True
        if request.data.get('tema') != None:
            filters["tema"] = Tema.objects.get(nombre=request.data.get('tema'))
        if request.data.get('idioma') != None:
            filters["idioma"] = request.data.get('idioma')

        preguntas = self.model.objects.filter(**filters)
        
        if evento:
            preguntas = preguntas.exclude(creador=request.user)
        
        pks = preguntas.values_list('pk', flat=True)

        if len(pks) == 0:
            return Response({"error": "No existen preguntas suficientes."}, status=status.HTTP_404_NOT_FOUND)

        random_pk = choice(pks)
        preg_serial = self.serializer_class(self.model.objects.get(pk=random_pk))
        return Response({
            "enunciado": preg_serial.data["enunciado"],
            "opciones": preg_serial.data["opciones"],
            "imagen": preg_serial.data["imagen"]
            })


