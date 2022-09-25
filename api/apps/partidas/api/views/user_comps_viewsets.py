from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from random import choice

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.base.models import AnswerLogs, Evento, Opcion, Partida, Pregunta
from apps.partidas.api.serializers.user_comps_serializers import *
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import esAcierto, preguntaToJSON

class PartidaEventoViewSet(GenericViewSet):
    serializer_class = UserCompSerializer
    serializer_class_retrieve = UserCompReviewSerializer
    serializer_class_list = UserCompListSerializer
    pregunta_serializer = PreguntaSerializer
    model = UserComp
    
    def pregunta_aleatoria(self, usercomp):
        filters = {
            "evento": usercomp.evento,
        }

        preguntas_contestadas = list(usercomp.partida.preguntas.values_list('pregunta', flat=True))

        if len(preguntas_contestadas) == settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
            raise({"error": "Ya se ha completado el cuestionario."})

        preguntas = Pregunta.objects.exclude(creador = usercomp.user).exclude(id__in = preguntas_contestadas)
        preguntas_evento = preguntas.filter(**filters)

        pks = preguntas_evento.values_list('pk', flat = True)

        if len(preguntas) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO - len(preguntas_contestadas):
            raise({'error': "No existen preguntas suficientes."})
        # Tomar preguntas del mazo 'bueno'
        elif len(pks) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO - len(preguntas_contestadas):
            otras_preguntas =  preguntas.filter(tema = usercomp.evento.tema, idioma = usercomp.evento.idioma).exclude(estado = 1, evento = usercomp.evento) # TODO es necesario evento?
            pks +=  otras_preguntas.values_list('pk', flat = True)
   
        return choice(pks)

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            usercomps = self.filter_queryset(self.get_queryset()).order_by("-partida__modified_date")
            page = self.paginate_queryset(usercomps)
            if page is not None:
                usercomps_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(usercomps_serial.data)
            usercomps_serial = self.serializer_class_list(usercomps, many = True)
            return Response(usercomps_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, pk=None):
        usercomp = self.get_object()
        if request.user.is_staff or (usercomp.user == request.user and usercomp.evento.fase_actual == 'Ver resultados test'):
            usercomp_serializer = self.serializer_class_retrieve(usercomp)
            return Response(usercomp_serializer.data)
        return Response({"error": "No tienes acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            event = get_object_or_404(Evento, pk = request.data.get('evento',None))
            pregunta_propia = Pregunta.objects.filter(evento = event, creador = request.user)
            partida_previa = UserComp.objects.filter(evento = event, user = request.user)
            if pregunta_propia:
                if not partida_previa:
                    if event.fase_actual == 'Realizar test':
                        # TODO Partida -> dispositivo
                        partida = Partida(tema = request.data.get('tema', None), idioma = request.data.get('idioma', None))
                        partida.save()
                        usercomp = self.model(user = request.user, partida = partida, evento = event)
                        usercomp.save()
                        return Response(self.serializer_class(usercomp).data, status = status.HTTP_201_CREATED)
                    return Response({"error": "No se puede crear la partida en esta fase del evento."}, status=status.HTTP_403_FORBIDDEN)
                return Response({"error": "Ya has creado una partida para este evento."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "El usuario no participó en la primera fase."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Añado una pregunta mas a la partida, y la devuelvo al cliente
    def update(self, request, pk=None):
        usercomp = self.get_object()
        if usercomp.user == request.user:
            if timezone.now() < usercomp.partida.created_date + timezone.timedelta(minutes=settings.MINUTOS_POR_CUESTIONARIO):
                try:
                    pk_preg = self.pregunta_aleatoria(usercomp)
                except Exception as e:
                    return Response(e, status=status.HTTP_400_BAD_REQUEST)

                log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=usercomp.partida)
                log.save()
                data = preguntaToJSON(pk_preg, log.pk)
                # TODO considerar si tengo que mandar el temporizador a cada rato
                return Response(data)
            return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)

    # Recibe la respuesta a la pregunta por parte del usuario
    def partial_update(self, request, pk=None):
        log = get_object_or_404(AnswerLogs, pk=pk)
        if log.partida.participacion.user == request.user:
            now = timezone.now()
            if log.respuesta_user == None and now < log.partida.created_date + timezone.timedelta(minutes=settings.MINUTOS_POR_CUESTIONARIO):
                respuesta = request.data.get('respuesta')
                opcion = get_object_or_404(Opcion, texto=respuesta, pregunta=log.pregunta.id)
                data = {
                    "timeFin": now,
                    "respuesta_user": opcion.id,
                    "acierto": esAcierto(log, respuesta),
                }
                a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)
                if a_l_serializer.is_valid():
                    a_l_serializer.save()
                    return Response({"message": "Respuesta guardada correctamente."})
            return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)