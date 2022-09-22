from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.shortcuts import get_object_or_404
from random import choice
from django.utils import timezone

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.base.models import AnswerLogs, Opcion, Partida, Pregunta, Repaso
from apps.partidas.api.serializers.repasos_serializers import RepasoListSerializer, RepasoReviewSerializer, RepasoSerializer
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import esAcierto, preguntaToJSON

class PartidaRepasoViewSet(GenericViewSet):
    serializer_class = RepasoSerializer
    serializer_class_retrieve = RepasoReviewSerializer
    serializer_class_list = RepasoListSerializer
    pregunta_serializer = PreguntaSerializer
    model = Repaso
    
    def pregunta_aleatoria(self, partida):
        filters = {
            "estado": 2
        }
        
        tema = partida.tema
        idioma = partida.idioma 
        
        if tema: filters['tema']  = tema
        if idioma: filters['idioma'] = idioma

        preguntas = Pregunta.objects.filter(**filters)
        pks = preguntas.values_list('pk', flat = True)
        
        if len(pks) <= 1:
            raise({'error': "No existen preguntas suficientes."})

        preguntas_contestadas = list(partida.preguntas.values_list('pregunta', flat=True))
        if len(pks) > 15:
            preguntas_contestadas = preguntas_contestadas[max(-15, -len(preguntas_contestadas)):]
        else:
            preguntas_contestadas = preguntas_contestadas[max(-len(pks)+1, -len(preguntas_contestadas)):]

        pks = preguntas.exclude(pk__in=preguntas_contestadas).values_list('pk', flat = True)

        return choice(pks)

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            # TODO filter by created_date (CURSO)(lo mismo para user_comp y para duelos)
            repasos = self.filter_queryset(self.get_queryset()).order_by("-partida__modified_date")
            page = self.paginate_queryset(repasos)
            if page is not None:
                repasos_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(repasos_serial.data)
            repasos_serial = self.serializer_class_list(repasos, many = True)
            return Response(repasos_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, pk=None):
        repaso = self.get_object()
        if request.user.is_staff or repaso.user == request.user:
            repaso_serializer = self.serializer_class_retrieve(repaso)
            return Response(repaso_serializer.data)
        return Response({"error": "No tiene acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            # TODO Partida -> dispositivo
            partida = Partida(tema = request.data.get('tema', None), idioma = request.data.get('idioma', None))
            partida.save()
            repaso = self.model(user = request.user, partida = partida)
            repaso.save()
            return Response(self.serializer_class(repaso).data, status = status.HTTP_201_CREATED)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Añado una pregunta mas a la partida, y la devuelvo al cliente
    def update(self, request, pk=None):
        repaso = self.get_object()
        if repaso.user == request.user:
            pk_preg = self.pregunta_aleatoria(repaso.partida)
            log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=repaso.partida)
            log.save()
            data = preguntaToJSON(pk_preg, log.pk)
            return Response(data)
        return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)

    # Recibe la respuesta a la pregunta por parte del usuario
    def partial_update(self, request, pk=None):
        log = get_object_or_404(AnswerLogs, pk=pk)
        if log.partida.repaso.user == request.user:
            if log.respuesta_user == None:
                respuesta = request.data.get('respuesta', None)
                correcta = get_object_or_404(Opcion, pregunta = log.pregunta.id, esCorrecta=True)
                opcion = get_object_or_404(Opcion, texto=respuesta, pregunta=log.pregunta.id)
                data = {
                    "timeFin": timezone.now(),
                    "respuesta_user": opcion.id,
                    "acierto": esAcierto(log, respuesta),
                }
                a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)
                if a_l_serializer.is_valid():
                    a_l_serializer.save()
                    return Response({"solucion": correcta.texto})
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Ya se ha contestado a esta pregunta."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)