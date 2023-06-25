from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, Avg, F, DurationField
from django.db.models.functions import TruncDate
from django.utils import timezone
from apps.users.models import User
from apps.eventos.models import Evento
from apps.preguntas.models import Pregunta, Report
from apps.partidas.models import Partida, Repaso, AnswerLogs, Duelos, UserComp


@api_view(['GET'])
def estadisticas(request):
    if request.user.is_staff:
        # Numero de alumnos registrados
        n_users = User.objects.filter(is_staff = False).count()
        # Tiempo jugado (solo cuenta el tiempo de las preguntas respondidas)
        tiempo = AnswerLogs.objects.filter(timeFin__isnull=False).aggregate(total=Sum(F('timeFin') - F('timeIni'), output_field = DurationField()))
        # Número de partidas totales
        n_total_partidas = Partida.objects.count()
        # Número de reportes totales
        n_total_reports = Report.objects.count()
        # Desglose de los reportes por estado y evento
        reports = Report.objects.values('estado', 'evento__name').annotate(numero=Count('pk'), evento=F('evento__name')).values('estado', 'evento', 'numero')
        # Número de preguntas totales
        n_total_preguntas = Pregunta.objects.exclude(estado=3).count()
        # Desglose de las preguntas por tema e idioma
        preguntas = Pregunta.objects.values('tema__nombre', 'idioma').annotate(tema=F('tema__nombre'), numero=Count('pk')).values('tema', 'idioma', 'numero')

        # STATS LAST MONTH
        #last_month = timezone.now() - timezone.timedelta(days = 30)
        # Partidas, preguntas y reports del último mes
        #partidas_mes = Partida.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))
        #preguntas_mes = Pregunta.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))
        #reports_mes = Report.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))

        # Desglose de acierto por tema e idioma
        n_logs = AnswerLogs.objects.values('partida__tema__nombre', 'partida__idioma', 'acierto').annotate(tema=F('partida__tema__nombre'), idioma=F('partida__idioma'), numero=Count('pk')).values('tema', 'idioma', 'acierto', 'numero')

        # STATS REPASOS
        # Número de repasos totales por tema e idioma
        n_repasos = Repaso.objects.values('partida__tema__nombre', 'partida__idioma').annotate(tema=F('partida__tema__nombre'), idioma=F('partida__idioma'), numero=Count('pk')).values('tema', 'idioma', 'numero')
        # Media de preguntas por repaso
        preguntas_repasos_media = Repaso.objects.values('pk').annotate(preguntas_len=(Count(F('partida__preguntas')))).aggregate(media=Avg(F('preguntas_len')))
        # Desglose de aciertos en repasos
        n_logs_repasos = Repaso.objects.values('partida__preguntas__acierto').annotate(acierto=F('partida__preguntas__acierto'), numero=Count('pk')).values('acierto', 'numero')

        # STATS EVENTOS
        # Desglose de eventos totales
        n_eventos = Evento.objects.values('tema__nombre', 'idioma').annotate(tema=F('tema__nombre'), numero=Count('pk')).values('tema', 'idioma', 'numero')
        # Media de valoración de cada evento
        media_valoracion_eventos = UserComp.objects.values('evento__name').annotate(evento=F('evento__name'), media=Avg('valoracion')).values('evento', 'media')
        # Media de puntos de cada evento
        media_puntos = UserComp.objects.values('evento__name').annotate(evento=F('evento__name'), media=Avg('score')).values('evento', 'media')
        # Número de preguntas creadas por evento
        preguntas_creadas = Pregunta.objects.values('evento__name').filter(evento__name__isnull=False).annotate(evento=F('evento__name'), numero=Count('pk')).values('evento', 'numero')

        # STATS DUELOS
        # Desglose de duelos por tema e idioma
        n_duelos = Duelos.objects.values('partidaUser1__tema__nombre', 'partidaUser1__idioma').annotate(tema=F('partidaUser1__tema__nombre'), idioma=F('partidaUser1__idioma'), numero=Count('pk')).values('tema', 'idioma', 'numero')
        # Desglose de duelos por estado
        estado_duelos = Duelos.objects.values('estado').annotate(numero=Count('pk'))

        print(tiempo)
        return Response({
            'usuarios': n_users,
            'tiempo_jugado': {
                'horas': tiempo['total'].seconds // 3600 if tiempo['total'] is not None else 0,
                'minutos': (tiempo['total'].seconds // 60 ) % 60 if tiempo['total'] is not None else 0,
                'segundos': tiempo['total'].seconds % 60 if tiempo['total'] is not None else 0,
            },
            'partidas_totales': n_total_partidas,
            'reports_totales': n_total_reports,
            'reports': reports,
            'preguntas_totales': n_total_preguntas,
            'preguntas': preguntas,
            #'partidas_mes': partidas_mes,
            #'preguntas_mes': preguntas_mes,
            #'reports_mes': reports_mes,
            'porcentaje_acierto': n_logs,
            'repasos_totales': n_repasos,
            'media_preguntas_repaso': preguntas_repasos_media['media'],
            'aciertos_en_repasos': n_logs_repasos,
            'eventos_totales': n_eventos,
            'media_valoracion_eventos': media_valoracion_eventos,
            'media_puntos_evento': media_puntos,
            'preguntas_creadas_evento': preguntas_creadas,
            'duelos_totales': n_duelos,
            'estado_duelos': estado_duelos,
        })
    return Response({'error': 'Acceso restringido para los alumnos.'}, status=status.HTTP_403_FORBIDDEN)