from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.partidas.models import AnswerLogs, Evento, Partida, UserComp
from apps.preguntas.models import Pregunta, Opcion
from apps.partidas.api.serializers.user_comps_serializers import *
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import esAcierto, preguntaToJSON, preguntas_usercomp, pregunta_aleatoria

class PartidaEventoViewSet(GenericViewSet):
    serializer_class = UserCompSerializer
    serializer_class_retrieve = UserCompReviewSerializer
    serializer_class_list = UserCompListSerializer
    pregunta_serializer = PreguntaSerializer
    model = UserComp

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            usercomps = self.filter_queryset(self.get_queryset()).order_by("-modified_date")
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
                        partida = Partida(tema = event.tema, idioma = event.idioma)
                        partida.save()
                        usercomp = self.model(user = request.user, partida = partida, evento = event)
                        print(usercomp) # TODO: Ver si aqui hay ID, y si es asi quitar uc
                        usercomp.save()
                        
                        uc = self.model.objects.get(pk=usercomp.data['id'])
                        respuesta = usercomp.data
                        preguntas_seleccionadas = preguntas_usercomp(uc)

                        # Create answer logs
                        for p in preguntas_seleccionadas:
                            log = AnswerLogs(pregunta=Pregunta.objects.get(pk=p['id']), partida=uc.partida)
                            log.save()

                        respuesta['preguntas'] = preguntas_seleccionadas
                        return Response(respuesta, status = status.HTTP_201_CREATED)
                    return Response({"error": "No se puede crear la partida en esta fase del evento."}, status=status.HTTP_403_FORBIDDEN)
                return Response({"error": "Ya has jugado una partida en este evento."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "El usuario no participó en la primera fase."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, pk=None):
        usercomp = self.get_object()
        respuestas = request.data.get('respuestas', None)
        if respuestas:
            if usercomp.user == request.user:
                for r in respuestas:
                    log = AnswerLogs(pregunta=Pregunta.objects.get(pk=r['id']), partida=usercomp.partida)
                    log.respuesta = r['respuesta'] if r['respuesta'] else None
                    log.timeIni = r['timeIni'] if r['timeIni'] else None
                    log.timeFin = r['timeFin'] if r['timeFin'] else None
                    log.acierto = esAcierto(log.pregunta, log.respuesta)
                    if r['valoracion']:
                        log.pregunta.nValorada += 1
                        log.pregunta.valoracion += r['valoracion']
                    log.save()
                return Response({"message": "Respuestas guardadas correctamente.",
                                 "porcentaje": usercomp.partida.porcentaje_acierto,
                                 "tiempo": usercomp.partida.tiempo}, 
                                 status=status.HTTP_200_OK)
            
            return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": {"respuestas": "Este campo es requerido"}})

    # Recibe la respuesta a la pregunta por parte del usuario
    # def partial_update(self, request, pk=None):
    #     log = get_object_or_404(AnswerLogs, pk=pk)
    #     if log.partida.participacion.user == request.user:
    #         now = timezone.now()
    #         if log.respuesta_user == None and now < log.partida.created_date + timezone.timedelta(minutes=settings.MINUTOS_POR_CUESTIONARIO):
    #             respuesta = request.data.get('respuesta')
    #             opcion = get_object_or_404(Opcion, texto=respuesta, pregunta=log.pregunta.id)
    #             data = {
    #                 "timeFin": now,
    #                 "respuesta_user": opcion.id,
    #                 "acierto": esAcierto(log, respuesta),
    #             }
    #             a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)
    #             if a_l_serializer.is_valid():
    #                 a_l_serializer.save()
    #                 return Response({"message": "Respuesta guardada correctamente."})
    #         return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_403_FORBIDDEN)
    #     return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)