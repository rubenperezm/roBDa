from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.base.models import Evento, Pregunta
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
            eventos = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(eventos)
            if page is not None:
                eventos_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(eventos_serial.data)
            eventos_serial = self.serializer_class_list(eventos, many = True)
            return Response(eventos_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['PUT'])
def terminar_evento(request, pk=None):
        if request.user.is_staff:
            evento = Evento.objects.get(pk=pk)
            preguntas = Pregunta.objects.filter(evento = pk, estado = 4)
            if evento.fase_actual == 'Esperando corrección del profesor' and not preguntas:
                evento.terminada = True
                evento.save()
                Pregunta.objects.filter(evento = pk, estado = 1).update(estado = 2)
                return Response({'message': f'\'{evento.name}\' ha terminado. Los resultados estarán disponibles para los alumnos.'})
            return Response({'error': 'Para terminar el evento debe estar en la última fase y no haber preguntas reportadas relacionadas con el mismo.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Acción no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)