from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import F
from api.settings import VALOR_K, NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.preguntas.models import Pregunta, Opcion, Tema
from apps.partidas.models import Partida, Repaso, AnswerLogs, UsuarioPregunta
from apps.partidas.api.serializers.repasos_serializers import RepasoListSerializer, RepasoReviewSerializer, RepasoSerializer
from apps.partidas.api.serializers.general_serializers import AnswerLogsSerializer
from apps.partidas.api.views.utils import esAcierto, pregunta_aleatoria, preguntaToJSON

class PartidaRepasoViewSet(GenericViewSet):
    serializer_class = RepasoSerializer
    serializer_class_retrieve = RepasoReviewSerializer
    serializer_class_list = RepasoListSerializer
    pregunta_serializer = PreguntaSerializer
    model = Repaso

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
        if request.user.is_staff:
            repaso_serializer = self.serializer_class_retrieve(repaso)
            return Response(repaso_serializer.data)
        return Response({"error": "No tiene acceso al informe de esta partida."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        if not request.user.is_staff and request.user.is_active:
            tema = request.data.get('tema', None)
            idioma = request.data.get('idioma', None)
            if tema and idioma:
                tema = Tema.objects.get(nombre = tema)
                if Pregunta.objects.filter(tema = tema, idioma = idioma, estado = 2).count() < NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
                    return Response({"error": {"tema": "No existen suficientes preguntas con el tema e idioma elegido.", "idioma": "No existen suficientes preguntas con el tema e idioma elegido."}}, status=status.HTTP_400_BAD_REQUEST)
                partida = Partida(tema = tema, idioma = idioma)
                partida.save()
                repaso = self.model(user = request.user, partida = partida)
                repaso.save()
                return Response(self.serializer_class(repaso).data, status = status.HTTP_201_CREATED)
            return Response({"error": "Se necesita indicar tema e idioma."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los profesores no pueden crear partidas."}, status=status.HTTP_403_FORBIDDEN)

    # Añado una pregunta mas a la partida, y la devuelvo al cliente
    def update(self, request, pk=None):
        repaso = self.get_object()
        if repaso.user == request.user:
            pk_preg = pregunta_aleatoria(repaso.partida)
            log = AnswerLogs(pregunta=Pregunta.objects.get(pk=pk_preg), partida=repaso.partida, timeIni=timezone.now())
            log.save()
            data = preguntaToJSON(pk_preg, log.pk)
            return Response(data)
        return Response({"error": "La partida seleccionada no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)

    # Recibe la respuesta a la pregunta por parte del usuario
    def partial_update(self, request, pk=None):
        log = get_object_or_404(AnswerLogs, pk=pk)
        
        if log.partida.repaso.user == request.user:
            if log.respuesta == None:
                respuesta = request.data.get('respuesta', None)
                print(respuesta)
                correcta = get_object_or_404(Opcion, pregunta = log.pregunta.id, esCorrecta=True)
                opcion = get_object_or_404(Opcion, pk=respuesta, pregunta=log.pregunta.id)

                # val = request.data.get('valoracion', 0)

                # if val != 0:
                #     log.pregunta.valoracionAcumulada += val
                #     log.pregunta.nValorada += 1
                #     log.pregunta.save()
                    
                data = {
                    "timeFin": timezone.now(),
                    "respuesta": opcion.id,
                    "acierto": esAcierto(log.pregunta, Opcion.objects.get(pk=respuesta)),
                }

                UsuarioPregunta.objects.filter(user = request.user, pregunta = log.pregunta).update(historico=F('historico') + VALOR_K*(1 - int(data["acierto"]) - F('historico')))
                
                a_l_serializer = AnswerLogsSerializer(log, data = data, partial = True)

                if a_l_serializer.is_valid():
                    a_l_serializer.save()
                    return Response({"solucion": correcta.texto})
                return Response({"error": "No se ha podido registrar la respuesta."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Ya se ha contestado a esta pregunta."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "El registro seleccionado no pertenece al usuario."}, status=status.HTTP_403_FORBIDDEN)
    
@api_view(['PATCH'])
def valorar_pregunta(request, pk=None):
        if not request.user.is_staff:
            val = request.data.get('valoracion', None)
            if val and val >= 1 and val <= 5:
                log = get_object_or_404(AnswerLogs, pk=pk)
                log.pregunta.valoracionAcumulada += val
                log.pregunta.nValorada += 1
                log.pregunta.save()

                return Response({"valoracion": log.pregunta.valoracionMedia})
            return Response({"error": "Indique una valoración entre 1 y 5."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Los profesores no pueden valorar preguntas."}, status=status.HTTP_403_FORBIDDEN)