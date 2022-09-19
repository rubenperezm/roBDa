from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django_filters.rest_framework.backends import DjangoFilterBackend
from django_filters.rest_framework.filterset import FilterSet
from django_filters import CharFilter, NumberFilter, ChoiceFilter
from random import choice
from datetime import datetime
from apps.base.models import Evento, Idioma, Pregunta, Report
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaListSerializer, PreguntaSerializer, PregutaConReportsSerializer, ReportSerializer

class PreguntaFilter(FilterSet):
    creador = CharFilter(field_name='creador__username', lookup_expr='contains')
    tema = NumberFilter(field_name='tema__id')
    idioma = ChoiceFilter(choices=Idioma.choices)
    evento = CharFilter(field_name='evento__name', lookup_expr='contains')
    class Meta:
        model = Pregunta
        fields = ['creador', 'evento', 'tema', 'idioma']

class PreguntaViewSet(ModelViewSet):
    serializer_class = PreguntaSerializer
    serializer_class_list = PreguntaListSerializer
    serializer_class_retrieve = PregutaConReportsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PreguntaFilter
    model = Pregunta

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.exclude(estado=3)
        return self.model.objects.filter(id=pk).exclude(estado=3).first()

    def list(self, request):
        if request.user.is_staff:
            # TODO para obtener los datos separados en EN_EVENTO, REPORTADA y SIN_ELIMINAR, simplemente filtrar por estado
            preguntas = self.filter_queryset(self.get_queryset()).order_by("-modified_date")
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

@api_view(['POST'])
def reportar(request, pk=None):
    if request.user.is_staff:
        data = {
            'reporter': request.user,
            'evento': Evento.objects.get(pk=request.data.get('evento', None)),
            'pregunta': Pregunta.objects.get(pk=pk),
            'motivo': request.data.get('motivo', None),
            'descripcion': request.data.get('descripcion', None),
            # TODO dispositivo...
        }

        report_serial = ReportSerializer(data=data)
        if report_serial.is_valid():
            report_serial.save()
            return Response({'detail': report_serial.data}, status=status.HTTP_201_CREATED)
        return Response({'error': report_serial.errors}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Solamente los alumnos pueden reportar preguntas."}, status=status.HTTP_400_BAD_REQUEST)