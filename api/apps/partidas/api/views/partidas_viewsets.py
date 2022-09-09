from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.shortcuts import get_object_or_404
from random import choice
from datetime import datetime

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.base.models import AnswerLogs, Imagen, Opcion, Partida, Pregunta, Tema
from apps.base.permissions import isNotStaff
from apps.partidas.api.serializers.partidas_serializers import AnswerLogsSerializer, PartidaSerializer


def preguntaJSON(pk, pk_log):
        preg_serial = PreguntaSerializer(Pregunta.objects.get(pk=pk))
        data = {
                "id_log": pk_log,
                "enunciado": preg_serial.data["enunciado"],
                "opciones": preg_serial.data["opciones"],
            }
        try:
            img = Imagen.objects.get(pk = preg_serial.data["imagen"])
            img_serial = ImagenSerializer(img)
            data["imagen"] =  img_serial.data["path"]
        except:
            pass
        return data

class PartidaRepasoViewSet(GenericViewSet):
    serializer_class = PartidaSerializer
    pregunta_serializer = PreguntaSerializer
    model = Partida
    # TODO sacar de la clase si necesito crear otra clase para los eventos
    def pregunta_aleatoria(self,request, partida):
        filters = {}
        # TODO sacar los parametros de la propia partida, ya que estan guardados con anterioridad
        # TODO el evento hay que tomarlo desde user-comp
        #evento = request.data.get('evento', None)
        idtema = request.data.get('tema', None)
        tema = Tema.objects.get(pk=request.data.get('tema')) if idtema else None
        idioma = request.data.get('idioma', None)

        #if evento:
        #    filters['evento'] = evento
        if tema and idioma:
            filters['tema'], filters['idioma'] = tema, idioma

        preguntas = Pregunta.objects.filter(**filters)
        #if evento:
        #    preguntas = preguntas.exclude(creador=request.user)
        
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
            print(last_questions)
            print(len(pks))
            while pk in last_questions:
                pk = choice(pks)
        return pk

    def get_queryset(self, pk=None):
        if pk is None:
            return self.model.objects.all()
        return self.model.objects.filter(id=pk).first()

    def list(self, request):
        if request.user.is_staff:
            partidas = self.get_queryset()
            partidas_serial = self.serializer_class(partidas, many = True)
            return Response(partidas_serial.data)
        return Response({"error": "Listado no disponible para el alumnado."}, status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, pk=None):
        partida = self.get_object()
        if request.user.is_staff or partida.usuario == request.user:
            partida_serializer = self.serializer_class(partida)
            return Response(partida_serializer.data)
        return Response({"error": "No tiene acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        if not request.user.is_staff:
            data = {"usuario": request.user.id, "modoJuego": 1}
            partida_serializer = self.serializer_class(data=data)
            if partida_serializer.is_valid():
                partida_serializer.save()
                return Response(partida_serializer.data)
            return Response({'error': partida_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Añado una pregunta mas a la partida, y la devuelvo al cliente
    def update(self, request, pk=None):
        partida = self.get_object()
        if partida.usuario == request.user:
            pk_preg = self.pregunta_aleatoria(request, partida)
            log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=partida)
            log.save()
            data = preguntaJSON(pk_preg, log.pk)
            return Response(data)
        return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)

    # Recibe la respuesta a la pregunta por parte del usuario
    def partial_update(self, request, pk=None):
        log = get_object_or_404(AnswerLogs, pk=pk)
        if log.partida.usuario == request.user:
            print(log.acierto is None)
            if log.acierto == None:
                respuesta = request.data.get('respuesta')
                correcta = get_object_or_404(Opcion, pregunta = log.pregunta.id, esCorrecta=True)
                opcion = get_object_or_404(Opcion, texto=respuesta, pregunta=log.pregunta.id)
                data = {
                    "timeFin": datetime.now(),
                    "respuesta_user": opcion.id,
                    "acierto": respuesta == correcta.texto,
                }
                a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)
                if a_l_serializer.is_valid():
                    a_l_serializer.save()
                    return Response({"solucion": correcta.texto})
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Ya se ha contestado a esta pregunta."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
