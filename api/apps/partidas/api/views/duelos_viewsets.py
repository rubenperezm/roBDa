from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from random import choice
from django.utils import timezone

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.base.models import AnswerLogs, Opcion, Partida, Pregunta, Duelos
from apps.partidas.api.serializers.duelos_serializers import *
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import *



class PartidaDueloViewSet(GenericViewSet):
    serializer_class = DuelosSerializer
    serializer_class_retrieve = DuelosReviewSerializer
    serializer_class_list = DuelosListSerializer
    serializer_class_list_play = DuelosListStudentSerializer
    pregunta_serializer = PreguntaSerializer
    model = Duelos


    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            duelos = self.filter_queryset(self.get_queryset()).filter(Q(estado=3)|Q(estado=4)).order_by("-partidaUser2__modified_date")
            page = self.paginate_queryset(duelos)
            if page is not None:
                duelos_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(duelos_serial.data)
            duelos_serial = self.serializer_class_list(duelos, many = True)
        else:
            duelos = self.filter_queryset(self.get_queryset()).filter(Q(user1 = request.user) | Q(user2 = request.user))
            page = self.paginate_queryset(duelos)
            if page is not None:
                duelos_serial = self.serializer_class_list_play(page, many = True)
                return self.get_paginated_response(duelos_serial.data)
            duelos_serial = self.serializer_class_list_play(duelos, many = True)
        return Response(duelos_serial.data)

    def retrieve(self, request, pk=None):
        duelo = self.get_object()
        if request.user.is_staff or (duelo.user1 == request.user or duelo.user2 == request.user and duelo.estado in [3,4]):
            duelo_serializer = self.serializer_class_retrieve(duelo)
            return Response(duelo_serializer.data)
        return Response({"error": "No tienes acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            user2 = get_object_or_404(User, username=request.data.get('user2', None))
            if request.user != user2:
                if not user2.is_staff and user2.is_active:
                    # TODO partida -> dispositivo
                    partida = Partida(tema = request.data.get('tema', None), idioma = request.data.get('idioma', None))
                    partida.save()
                    data = {
                        "user1": request.user.id,
                        "user2": user2,
                        "partidaUser1": partida.id,
                    }
                    duelo = self.serializer_class(data=data)
                    if duelo.is_valid():
                        print(duelo)
                        duelo.save()
                        d = self.model.objects.get(pk=duelo.data['id'])
                        respuesta = duelo.data
                        respuesta["preguntas"] = preguntas_user1(d.partidaUser1)
                        return Response(respuesta, status = status.HTTP_201_CREATED)
                    return Response({'error': duelo.errors}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"error": "No puedes retar al usuario seleccionado."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "No te puedes retar a tí mismo."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Añado una pregunta mas a la partida, y la devuelvo al cliente
    def update(self, request, pk=None):
        duelo = self.get_object()
        preguntas = request.data.get('preguntas', None)
        if preguntas:
            if duelo.user1 == request.user:
                if timezone.now() < duelo.partidaUser1.created_date + timezone.timedelta(minutes=settings.MINUTOS_POR_CUESTIONARIO):
                    try:
                        pk_preg = pregunta_aleatoria(duelo.partidaUser1, preguntas)
                    except Exception as e:
                        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

                    log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=duelo.partidaUser1)
                    log.save()
                    data = preguntaToJSON(pk_preg, log.pk)
                    # TODO considerar si tengo que mandar el temporizador a cada rato
                    return Response(data)
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_403_FORBIDDEN)
            elif duelo.user2 == request.user:
                if timezone.now() < duelo.partidaUser2.created_date + timezone.timedelta(minutes=settings.MINUTOS_POR_CUESTIONARIO):
                    try:
                        pk_preg = pregunta_aleatoria(duelo.partidaUser2, preguntas)
                    except Exception as e:
                        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                    log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=duelo.partidaUser2)
                    log.save()
                    data = preguntaToJSON(pk_preg, log.pk)
                    # TODO considerar si tengo que mandar el temporizador a cada rato
                    return Response(data)
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": {"preguntas": "Este campo es requerido"}})

    # Recibe la respuesta a la pregunta por parte del usuario
    def partial_update(self, request, pk=None):
        log = get_object_or_404(AnswerLogs, pk=pk)
        if (log.partida.partida_retador and log.partida.partida_retador.user1 == request.user or 
            log.partida.partida_retado and log.partida.partida_retado.user2 == request.user):
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


@api_view(['PATCH'])
def aceptar(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user2:
        if duelo.estado == 2:
            partida = Partida(tema = duelo.partidaUser1.tema, idioma = duelo.partidaUser1.idioma)
            partida.save()
            duelo.estado = 5
            duelo.partidaUser2 = partida
            duelo.save()
            return Response({"message": "Duelo aceptado.", "preguntas": preguntas_user2(duelo.partidaUser1)}, status=status.HTTP_200_OK)
        return Response({"error": "Solo puedes finalizar retos estén pendientes"}, status = status.HTTP_403_FORBIDDEN)
    return Response({"error": "No puedes finalizar esta partida."}, status=status.HTTP_403_FORBIDDEN)


@api_view(['PATCH'])
def finalizar(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user2:
        if duelo.estado == 5:
            duelo.estado = 3
            duelo.save()
            return Response({"message": "Duelo finalizado."}, status=status.HTTP_200_OK)
        return Response({"error": "Solo puedes finalizar retos estén pendientes"}, status = status.HTTP_403_FORBIDDEN)
    return Response({"error": "No puedes finalizar esta partida."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['PATCH'])
def rechazar(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user2:
        if duelo.estado == 2:
            duelo.estado = 4
            duelo.save()
            return Response({"message": "Duelo rechazado."}, status=status.HTTP_200_OK)
        return Response({"error": "Solo puedes rechazar retos estén pendientes"}, status = status.HTTP_403_FORBIDDEN)
    return Response({"error": "No puedes rechazar esta partida."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['PATCH'])
def retar(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user1:
        if duelo.estado == 1:
            duelo.estado = 2
            duelo.save()
            return Response({"message": "Duelo enviado al rival."}, status=status.HTTP_200_OK)
        return Response({"error": "Solo puedes enviar retos que recién hayas completado"}, status = status.HTTP_403_FORBIDDEN)
    return Response({"error": "No puedes enviar como reto esta partida."}, status=status.HTTP_403_FORBIDDEN)

