from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from api.settings import NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.partidas.models import AnswerLogs, Partida, Duelos
from apps.preguntas.models import Pregunta, Opcion, Tema
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
        if request.user.is_staff: # Todos los duelos (profesores)
            duelos = self.filter_queryset(self.get_queryset()).filter(Q(estado=3)|Q(estado=4)).order_by("-modified_date")
            page = self.paginate_queryset(duelos)
            if page is not None:
                duelos_serial = self.serializer_class_list(page, many = True)
                return self.get_paginated_response(duelos_serial.data)
            duelos_serial = self.serializer_class_list(duelos, many = True)
        else: # Duelos propios (alumnos)
            duelos = self.filter_queryset(self.get_queryset()).filter(Q(user1 = request.user) | Q(user2 = request.user), ~Q(estado=4)).exclude(estado=1, user2=request.user).order_by("-modified_date")
            page = self.paginate_queryset(duelos)
            if page is not None:
                duelos_serial = self.serializer_class_list_play(page, many = True)
                return self.get_paginated_response(duelos_serial.data)
            duelos_serial = self.serializer_class_list_play(duelos, many = True)
        return Response(duelos_serial.data)

    def retrieve(self, request, pk=None):
        duelo = self.get_object()
        if request.user.is_staff or (duelo.user1 == request.user or duelo.user2 == request.user and duelo.estado != 4):
            duelo_serializer = self.serializer_class_retrieve(duelo)
            return Response(duelo_serializer.data)
        return Response({"error": "No tienes acceso a esta partida."}, status=status.HTTP_403_FORBIDDEN)

    # USUARIO 1 CREA LA PARTIDA
    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            user2 = User.objects.filter(username=request.data.get('user2', None)).first()
            if user2 and not user2.is_staff and user2 and user2.is_active:
                if request.user != user2:
                    tema = request.data.get('tema', None)
                    idioma = request.data.get('idioma', None)
                    if not tema or not idioma:
                        return Response({"error": "No se ha especificado el tema o el idioma."}, status=status.HTTP_400_BAD_REQUEST)
                    if Pregunta.objects.filter(tema__nombre=tema, idioma=idioma).count() < NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
                        return Response({"error": {"tema": "No existen suficientes preguntas con el tema e idioma elegido.", "idioma": "No existen suficientes preguntas con el tema e idioma elegido."}}, status=status.HTTP_400_BAD_REQUEST)

                    partida = Partida(tema = Tema.objects.filter(nombre=tema).first(), idioma = idioma)
                    partida.save()
                    data = {
                        "user1": request.user.id,
                        "user2": user2,
                        "partidaUser1": partida.id,
                    }
                    duelo = self.serializer_class(data=data)
                    if duelo.is_valid():
                        duelo.save()

                        return Response(duelo.data, status = status.HTTP_201_CREATED)
                    return Response({'error': duelo.errors}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"error": {"user2": "No te puedes retar a tí mismo."}}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": {"user2": "Introduce un rival válido."}}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "No puede crear duelos."}, status=status.HTTP_403_FORBIDDEN)

    # Guardar las preguntas del cuestionario en AnswerLogs
    def update(self, request, pk = None):
        duelo = self.get_object()
        if duelo.user1 == request.user:
            partida = duelo.partidaUser1
        elif duelo.user2 == request.user:
            partida = duelo.partidaUser2
        else:
            return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
        
        if partida.preguntas.filter(timeIni__isnull=False).exists():
            return Response({"error": "La partida ya ha sido jugada."}, status=status.HTTP_400_BAD_REQUEST)
        respuestas = request.data.get('respuestas', None)
        if respuestas:
            for r in respuestas:
                # Update AnswerLogs
                log = AnswerLogs.objects.get(pregunta=Pregunta.objects.get(pk=r['id']), partida=partida)
                log.respuesta = Opcion.objects.get(pk=r['respuesta']) if 'respuesta' in r else None
                log.timeIni = r['timeIni'] if 'timeIni' in r else None
                log.timeFin = r['timeFin'] if 'timeFin' in r else None
                log.acierto = esAcierto(log.pregunta, log.respuesta)
                log.save()
            
            return Response({"message": "Respuestas guardadas correctamente.",
                             "porcentaje": partida.porcentaje_acierto,
                             "tiempo": partida.tiempo},
                             status=status.HTTP_200_OK)
        return Response({"error": {"respuestas": "Este campo es requerido"}}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def decidir(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user2:
        if duelo.estado == 2:
            decision = request.data.get('decision', None)
            if decision:
                partida = Partida(tema = duelo.partidaUser1.tema, idioma = duelo.partidaUser1.idioma)
                partida.save()
                duelo.estado = 5
                duelo.partidaUser2 = partida
            else:
                duelo.estado = 4
            duelo.save()
            return Response({"message": "Duelo aceptado." if decision else "Duelo rechazado"}, status=status.HTTP_200_OK)
        return Response({"error": "Solo puedes decidir retos que estén pendientes"}, status = status.HTTP_403_FORBIDDEN)
    return Response({"error": "No puedes decidir en esta partida."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def getPreguntas(request, pk=None):
    duelo = get_object_or_404(Duelos, pk=pk)
    if request.user == duelo.user1 and duelo.estado == 1 and duelo.partidaUser1.preguntas.count() == 0:
        partida = duelo.partidaUser1
        duelo.estado = 2
        preguntas = preguntas_user1(partida)
    elif request.user == duelo.user2 and duelo.estado == 5 and duelo.partidaUser2.preguntas.count() == 0:
        partida = duelo.partidaUser2
        duelo.estado = 3
        preguntas = preguntas_user2(duelo.partidaUser1)
    else:
        return Response({"error": "No puedes obtener las preguntas de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    duelo.save()
    for p in preguntas:
        log = AnswerLogs(pregunta=Pregunta.objects.get(pk=p['id']), partida=partida)
        log.save()

    return Response(preguntas, status=status.HTTP_200_OK)