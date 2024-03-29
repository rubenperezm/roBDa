from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaResueltaSerializer
from apps.partidas.api.serializers.user_comps_serializers import UserCompReviewSerializer
from apps.eventos.models import Evento
from apps.preguntas.models import Idioma, Pregunta, Report
from apps.partidas.models import UserComp
from apps.base.permissions import esProfeOSoloLectura
from apps.eventos.api.serializers.eventos_serializers import EventoListSerializer, EventoSerializer, EventoStudentSerializer
from django_filters.rest_framework import FilterSet, CharFilter, MultipleChoiceFilter, BooleanFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from api.settings import NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO

class EventoFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='contains')
    tema = CharFilter(field_name='tema__nombre')
    idioma = MultipleChoiceFilter(choices=Idioma.choices)
    terminada = BooleanFilter(field_name='terminada')
    class Meta:
        model = Evento
        fields = ['name', 'tema', 'idioma', 'terminada']

class EventoViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = EventoSerializer
    serializer_student_class = EventoStudentSerializer
    serializer_class_list = EventoListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventoFilter
    model = Evento
  
    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        eventos = self.filter_queryset(self.get_queryset()).order_by('terminada', '-modified_date')
        page = self.paginate_queryset(eventos)
        if page is not None:
            eventos_serial = self.serializer_class_list(page, many = True)
            return self.get_paginated_response(eventos_serial.data)
        eventos_serial = self.serializer_class_list(eventos, many = True)
        return Response(eventos_serial.data)
    
    def retrieve(self, request, pk=None):
        evento = self.get_queryset(pk)
        if evento is not None:
            if request.user.is_staff:
                evento_serial = self.serializer_class(evento)
                return Response(evento_serial.data)
            else:
                evento_serial = self.serializer_student_class(evento)
                participacion = UserComp.objects.filter(evento = evento, user = request.user).first()
                participacion_serial = UserCompReviewSerializer(participacion).data if participacion is not None else None
                pregunta = Pregunta.objects.filter(evento = evento, creador = request.user).first()
                pregunta_serial = PreguntaResueltaSerializer(pregunta).data if pregunta is not None else None
                return Response({'evento': evento_serial.data, 'participacion': participacion_serial, 'pregunta': pregunta_serial})

        return Response({'error': 'No existe un evento con ese id.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        if request.user.is_staff:
            tema = request.data.get('tema')
            idioma = request.data.get('idioma')
            if Pregunta.objects.filter(tema__nombre = tema, idioma = idioma, estado = 2).count() < NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
                return Response({"tema": ["No existen suficientes preguntas con el tema e idioma elegido."], "idioma": ["No existen suficientes preguntas con el tema e idioma elegido."]}, status=status.HTTP_400_BAD_REQUEST)
            evento_serial = self.serializer_class(data = request.data)
            if evento_serial.is_valid():
                evento_serial.save()
                return Response(evento_serial.data, status=status.HTTP_201_CREATED)
            return Response(evento_serial.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los alumnos no pueden crear eventos."}, status=status.HTTP_403_FORBIDDEN)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.is_staff:
            instance = self.get_object()
            if instance.fase_actual != 'Finalizada':
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'error': 'No se puede eliminar un evento finalizado.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los alumnos no pueden borrar preguntas."}, status=status.HTTP_403_FORBIDDEN)
    
    def update(self, request, *args, **kwargs):
        if request.user.is_staff:
            instance = self.get_object()
            if instance.fase_actual != 'Finalizada':
                return super().update(request, *args, **kwargs)
            return Response({'error': 'No se puede modificar un evento finalizado.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los alumnos no pueden modificar preguntas."}, status=status.HTTP_403_FORBIDDEN)


class terminar_evento(APIView):
    model = Evento
    def put(self, request, pk=None):
            if request.user.is_staff:
                evento = get_object_or_404(self.model, pk=pk)
                reports_evento = Report.objects.filter(evento = pk, estado = 1)
                if evento.fase_actual == 'Esperando corrección del profesor' and not reports_evento:
                    user_comps = UserComp.objects.filter(evento=pk)
                    for user_comp in user_comps:
                        user_comp.score = user_comp.score_f1 + user_comp.score_f2 + user_comp.score_f3 # f3 son los reports

                    UserComp.objects.bulk_update(user_comps, ['score'])
                    Pregunta.objects.filter(evento = pk, estado = 1).update(estado = 2)
                    evento.terminada = True
                    evento.save()
                    return Response({'message': f'\'{evento.name}\' ha terminado. Los resultados estarán disponibles para los alumnos.'})
                return Response({'error': 'Para terminar el evento debe estar en la última fase y no haber preguntas reportadas relacionadas con el mismo.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Acción no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)