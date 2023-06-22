from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.partidas.models import AnswerLogs, Evento, Partida, UserComp
from apps.preguntas.models import Pregunta, Opcion
from apps.partidas.api.serializers.user_comps_serializers import *
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import preguntas_usercomp, esAcierto

class PartidaEventoViewSet(GenericViewSet):
    serializer_class = UserCompSerializer
    serializer_class_retrieve = UserCompReviewSerializer
    serializer_class_list = UserCompListSerializer
    pregunta_serializer = PreguntaSerializer
    model = UserComp

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.filter(evento__terminada=True)
        return self.model.objects.filter(id=pk, evento__terminada=True).first()

    def list(self, request):
        if request.user.is_staff:
            usercomps = self.filter_queryset(self.get_queryset()).order_by("-evento", "-score")
            page = self.paginate_queryset(usercomps)
            if page is not None:
                usercomps_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(usercomps_serial.data)
            usercomps_serial = self.serializer_class_list(usercomps, many = True)
            return Response(usercomps_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, pk=None):
        usercomp = self.get_object()
        if request.user.is_staff or usercomp.user == request.user:
            usercomp_serializer = self.serializer_class_retrieve(usercomp)
            preg = Pregunta.objects.filter(evento = usercomp.evento, creador = usercomp.user).first()
            if preg:
                preg_serializer = self.pregunta_serializer(preg)
                return Response({"participacion": usercomp_serializer.data, "pregunta": preg_serializer.data})
            return Response(usercomp_serializer.data)
        return Response({"error": "No tienes acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    # Crea UserComp tras haber creado la pregunta
    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            event = get_object_or_404(Evento, pk = request.data.get('evento',None))
            pregunta_propia = Pregunta.objects.filter(evento = event, creador = request.user)
            partida_previa = UserComp.objects.filter(evento = event, user = request.user)
            if pregunta_propia:
                if not partida_previa:
                    usercomp = self.model(user = request.user, evento = event)
                    usercomp.save() 
                    return Response({"message": "Participación creada"}, status = status.HTTP_201_CREATED)
                return Response({"error": "Ya has jugado una partida en este evento."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "El usuario no participó en la primera fase."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Crea la partida, los AnswerLogs y devuelve las preguntas
    def update(self, request, pk=None):
        usercomp = self.get_object()
        if usercomp.user == request.user:
            if usercomp.partida == None:
                preguntas = preguntas_usercomp(usercomp)
                usercomp.partida = Partida.objects.create(tema=usercomp.evento.tema, idioma=usercomp.evento.idioma)
                usercomp.save()

                for p in preguntas:
                    log = AnswerLogs(pregunta=Pregunta.objects.get(pk=p['id']), partida=usercomp.partida)
                    log.save()

                return Response(preguntas)
            return Response({"error": "Ya has jugado esta partida."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)

    # Recibe las respuestas de las preguntas de la partida
    def partial_update(self, request, pk=None):
        uc = self.get_object()
        if uc.user != request.user:
            return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
        if uc.partida.preguntas.filter(timeIni__isnull=False).exists(): # TODO: Añadir un plazo para cerrar partida abandonada?
            return Response({"error": "La partida ya ha sido jugada."}, status=status.HTTP_400_BAD_REQUEST)
        respuestas = request.data.get('respuestas')
        if respuestas:
            for r in respuestas:
                # Update AnswerLogs
                log = AnswerLogs.objects.get(pregunta=Pregunta.objects.get(pk=r['id']), partida=uc.partida)
                log.respuesta = Opcion.objects.get(pk=r['respuesta']) if 'respuesta' in r else None
                log.timeIni = r['timeIni'] if 'timeIni' in r else None
                log.timeFin = r['timeFin'] if 'timeFin' in r else None
                log.acierto = esAcierto(log.pregunta, log.respuesta)
                log.save()
            
            return Response({"message": "Respuestas guardadas correctamente.",
                             "porcentaje": uc.partida.porcentaje_acierto,
                             "tiempo": uc.partida.tiempo},
                             status=status.HTTP_200_OK)
        return Response({"error": {"respuestas": "Este campo es requerido"}}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def valorar(request, pk=None):
    uc = get_object_or_404(UserComp, pk=pk)
    if not request.user.is_staff:
        valoracion = request.data.get('valoracion')
        if valoracion:
            uc.valoracion = valoracion
            uc.save()
            return Response({"message": "Valoración guardada correctamente."}, status=status.HTTP_200_OK)
        return Response({"error": {"valoracion": "Este campo es requerido"}}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Los profesores no pueden valorar partidas."}, status=status.HTTP_403_FORBIDDEN)