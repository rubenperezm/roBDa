from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from apps.eventos.models import Evento
from apps.preguntas.models import Pregunta, Report
from apps.partidas.models import UserComp
from apps.base.permissions import esProfeOSoloLectura
from apps.eventos.api.serializers.eventos_serializers import EventoListSerializer, EventoSerializer

class EventoViewSet(ModelViewSet):
    permission_classes = [esProfeOSoloLectura,]

    serializer_class = EventoSerializer
    serializer_class_list = EventoListSerializer
    model = Evento

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            # TODO crear filtro para filtrar por idioma o tema ? 
            eventos = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(eventos)
            if page is not None:
                eventos_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(eventos_serial.data)
            eventos_serial = self.serializer_class_list(eventos, many = True)
            return Response(eventos_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        if request.user.is_staff:
            instance = self.get_object()
            if instance.fase_actual != 'Finalizada':
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'error': 'No se puede eliminar un evento finalizado.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los alumnos no pueden borrar preguntas."}, status=status.HTTP_403_FORBIDDEN)


class terminar_evento(APIView):
    model = Evento
    def put(self, request, pk=None):
            if request.user.is_staff:
                evento = get_object_or_404(self.model, pk=pk)
                reports_evento = Report.objects.filter(evento = pk, estado = 1)
                if evento.fase_actual == 'Esperando corrección del profesor' and not reports_evento:
                    Pregunta.objects.filter(evento = pk, estado = 1).update(estado = 2)
                    for obj in UserComp.objects.filter(evento = pk):
                        obj.score = obj.score_f1 + obj.score_f2 + obj.score_f3
                        obj.save()
                    evento.terminada = True
                    evento.save()
                    return Response({'message': f'\'{evento.name}\' ha terminado. Los resultados estarán disponibles para los alumnos.'})
                return Response({'error': 'Para terminar el evento debe estar en la última fase y no haber preguntas reportadas relacionadas con el mismo.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Acción no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)