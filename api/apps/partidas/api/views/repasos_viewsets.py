from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.shortcuts import get_object_or_404
from random import choice
from datetime import datetime

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.base.models import AnswerLogs, Opcion, Partida, Pregunta, Repaso
from apps.partidas.api.serializers.repasos_serializers import RepasoListSerializer, RepasoReviewSerializer, RepasoSerializer
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import preguntaToJSON

class PartidaRepasoViewSet(GenericViewSet):
    serializer_class = RepasoSerializer
    serializer_class_retrieve = RepasoReviewSerializer
    serializer_class_list = RepasoListSerializer
    pregunta_serializer = PreguntaSerializer
    model = Repaso
    # TODO sacar de la clase si necesito crear otra clase para los eventos
    def pregunta_aleatoria(self, partida):
        filters = {
            "estado": 2
        }
        # TODO el evento hay que tomarlo desde user-comp
        tema = partida.tema
        idioma = partida.idioma 
        
        if tema: filters['tema']  = tema
        if idioma: filters['idioma'] = idioma

        preguntas = Pregunta.objects.filter(**filters)
        
        pks = preguntas.values_list('pk', flat = True)
        if len(pks) == 0:
            raise({'error': "No existen preguntas suficientes."})
        pk = choice(pks)
        preguntas_contestadas = list(partida.preguntas.values_list('pregunta', flat=True))
        if len(pks) > 15:
            last_questions = preguntas_contestadas[max(-15, -len(preguntas_contestadas)):]
            while pk in last_questions:
                pk = choice(pks)
        else:
            last_questions = preguntas_contestadas[max(-len(pks)+1, -len(preguntas_contestadas)):]
            while pk in last_questions:
                pk = choice(pks)
        return pk

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
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
        if not request.user.is_staff:
            partida = Partida(tema = request.data.get('tema', None), idioma = request.data.get('idioma', None))
            partida.save()
            repaso = self.model(user = request.user, partida = partida)
            repaso.save()
            return Response(self.serializer_class(repaso).data)
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
                respuesta = request.data.get('respuesta')
                correcta = get_object_or_404(Opcion, pregunta = log.pregunta.id, esCorrecta=True)
                opcion = get_object_or_404(Opcion, texto=respuesta, pregunta=log.pregunta.id)
                data = {
                    "timeFin": datetime.now(),
                    "respuesta_user": opcion.id,
                }
                a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)
                if a_l_serializer.is_valid():
                    a_l_serializer.save()
                    return Response({"solucion": correcta.texto})
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Ya se ha contestado a esta pregunta."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)