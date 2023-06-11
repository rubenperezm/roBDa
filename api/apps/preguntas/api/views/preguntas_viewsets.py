from gc import get_objects
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django_filters.rest_framework.backends import DjangoFilterBackend
from django_filters.rest_framework.filterset import FilterSet
from django_filters import CharFilter, MultipleChoiceFilter

from django.utils import timezone
from apps.preguntas.models import Idioma, Opcion, Pregunta, Report
from apps.partidas.models import AnswerLogs
from apps.eventos.models import Evento
from apps.preguntas.api.serializers.preguntas_serializers import (
    PreguntaListSerializer,
    PreguntaSerializer,
    PreguntaConReportsSerializer,
    ReportSerializer,
)


class PreguntaFilter(FilterSet):
    creador = CharFilter(field_name="creador__username", lookup_expr="contains")
    tema = CharFilter(field_name="tema__nombre")
    idioma = MultipleChoiceFilter(choices=Idioma.choices)
    estado = MultipleChoiceFilter(choices=Pregunta.EstadoPregunta.choices)
    evento = CharFilter(field_name="evento__name", lookup_expr="contains")

    class Meta:
        model = Pregunta
        fields = ["creador", "evento", "tema", "idioma", "estado"]


class PreguntaViewSet(GenericViewSet):
    serializer_class = PreguntaSerializer
    serializer_class_list = PreguntaListSerializer
    serializer_class_retrieve = PreguntaConReportsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PreguntaFilter
    model = Pregunta

    def get_queryset(self, pk=None):
        if pk is None:
            # Excluir las que estén en un evento no terminado
            return self.model.objects.exclude(estado=3).exclude(evento__finFase2__gte=timezone.now())
        return self.model.objects.filter(id=pk).exclude(estado=3).exclude(evento__finFase2__gte=timezone.now()).first()

    def list(self, request):
        if request.user.is_staff:
            preguntas = self.filter_queryset(self.get_queryset()).order_by(
                "-estado", "-created_date"
            )
            page = self.paginate_queryset(preguntas)
            if page is not None:
                preguntas_serial = self.serializer_class_list(page, many=True)
                return self.get_paginated_response(preguntas_serial.data)
            preguntas_serial = self.serializer_class_list(preguntas, many=True)
            return Response(preguntas_serial.data)
        return Response(
            {"error": "Listado no disponible para el alumnado."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request, pk=None):
        if request.user.is_staff:
            pregunta = self.get_object()
            pregunta_serializer = self.serializer_class_retrieve(
                pregunta, context={"request": request}
            )
            return Response(pregunta_serializer.data)
        return Response(
            {"error": "No puede ver esta pregunta."}, status=status.HTTP_403_FORBIDDEN
        )

    def create(self, request):
        data = request.data.copy()
        data["creador"] = request.user.id
        data["imagen"] = request.data.get("imagen", None)
        if request.user.is_staff:
            if request.data.get("idioma", None):
                data["idioma"] = request.data.get("idioma", None)
            data["tema"] = request.data.get("tema", None)
            data["estado"] = 2
        else:
            pk_evento = request.data.get("evento", None)
            event = get_object_or_404(Evento, pk=pk_evento)
            pregunta = Pregunta.objects.filter(creador=request.user.id, evento=event.id)
            if (
                timezone.now().timestamp() <= event.finFase1.timestamp()
            ) and not pregunta:
                data["idioma"] = event.idioma
                data["tema"] = event.tema
            else:
                return Response(
                    {
                        "error": "Sólo puede crearse una pregunta por evento, y debe de hacerse en la primera fase"
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        preg_serial = self.serializer_class(data=data)
        if preg_serial.is_valid():
            preg_serial.save()
            return Response(
                {"message": preg_serial.data}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"error": preg_serial.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    def partial_update(self, request, pk=None):
        if request.user.is_staff:
            pregunta = self.get_object()
            data = request.data.copy()
            options_data = data.pop("opciones", None)
            for option in options_data:
                op = Opcion.objects.get(id=option["id"])
                op.texto = option["texto"]
                op.esCorrecta = option["esCorrecta"]
                op.save()

            serial = PreguntaSerializer(pregunta, data=data, partial=True)
            if serial.is_valid():
                serial.save()
            return Response(serial.data)
        return Response(
            {"error": "Acción no permitida para el alumno."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def destroy(self, request, pk=None):
        if request.user.is_staff:
            pregunta = self.get_object()
            if pregunta:
                pregunta.estado = 3
                pregunta.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(
                {"error": "No existe pregunta con estos datos"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Los alumnos no pueden borrar preguntas."},
            status=status.HTTP_403_FORBIDDEN,
        )


class reportar(APIView):
    model = Pregunta

    def post(self, request):
        if not request.user.is_staff:
            log = get_object_or_404(AnswerLogs, pk=request.data.get("log", None))
            if (
                (hasattr(log.partida, "repaso") and log.partida.repaso.user != request.user)
                or (hasattr(log.partida, "participacion") and log.partida.participacion.user != request.user)
                or (hasattr(log.partida, "partida_retador") and log.partida.partida_retador.user1 != request.user)
                or (hasattr(log.partida, "partida_retado") and log.partida.partida_retado.user2 != request.user)
            ):
                return Response(
                    {"error": "No puedes reportar una pregunta que no has contestado."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            data = {
                "reporter": request.user.id,
                "pregunta": log.pregunta.id,
                "motivo": request.data.get("motivo", None),
                "descripcion": request.data.get("descripcion", None),
            }
            if log.pregunta.estado == 1:  # EN_EVENTO
                if log.pregunta.evento.fase_actual == "En juego":
                    data["evento"] = log.pregunta.evento
                else:
                    return Response(
                        {
                            "error": "No se pueden reportar preguntas fuera de la segunda fase."
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

            report_serial = ReportSerializer(data=data)
            if report_serial.is_valid():
                report_serial.save()
                log.pregunta.estado = 4
                log.pregunta.save()
                log.reportada = True
                log.save()
                return Response(
                    {"message": report_serial.data}, status=status.HTTP_201_CREATED
                )
            return Response(
                {"error": report_serial.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"error": "Solamente los alumnos pueden reportar preguntas."},
            status=status.HTTP_400_BAD_REQUEST,
        )

@api_view(["PATCH"])
def cambiar_estado_report(request, pk=None):
    if request.user.is_staff:
        report = get_object_or_404(Report, pk=pk)
        isAcepted = request.data.get("estado", False)
        if report.estado == 1:
            report.estado = 2 if isAcepted else 3
            report.save()
            
            reportsLeft = Report.objects.filter(pregunta=report.pregunta, estado=1).count()
            if reportsLeft == 0:
                report.pregunta.estado = 2 # Ya no está reportada
                report.pregunta.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"error": "No se puede cambiar el estado de un reporte cerrado."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(
        {"error": "Solamente los profesores pueden valorar un reporte."},
        status=status.HTTP_400_BAD_REQUEST,
    )