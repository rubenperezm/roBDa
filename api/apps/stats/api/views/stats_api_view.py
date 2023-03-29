from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, Avg, F, DurationField, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from apps.users.models import User
from apps.base.models import Partida, Pregunta, Report, Repaso, Duelos, Evento, UserComp, AnswerLogs

@api_view(['GET'])
def estadisticas(request):
    if request.user.is_staff: # TODO: Hacer el else para mostrar estadísticas de cada alumno
        n_users = User.objects.filter(is_staff = False).count()
        n_total_partidas = Partida.objects.count()
        n_total_reports = Report.objects.count()
        reports = Report.objects.values('estado', 'evento').annotate(numero=Count('pk'))
        n_total_preguntas = Pregunta.objects.count()
        preguntas = Pregunta.objects.values('estado').annotate(numero=Count('pk'))
        preguntas_respondidas = Partida.objects.annotate(numero=Count('preguntas'))
        preguntas_acertadas = Partida.objects.annotate(numero=Sum('aciertos'))


        # STATS LAST MONTH
        last_month = timezone.now() - timezone.timedelta(days = 30)
        partidas_mes = Partida.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))
        preguntas_mes = Pregunta.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))
        reports_mes = Report.objects.filter(created_date__gte=last_month).annotate(fecha=TruncDate('created_date')).values('fecha').annotate(numero=Count('pk'))

        porcentaje_aciertos_medio = Partida.objects.all().annotate(num_preguntas = Count('preguntas')
            ).values('tema_nombre', 'idioma', 'aciertos'
            ).annotate(num_partidas = Count('id'), porcentaje_acierto = Avg('aciertos') / Avg('num_preguntas') * 100)

        # STATS REPASOS
        n_repasos = Repaso.objects.values('partida__tema__nombre', 'partida__idioma').annotate(numero=Count('pk'))
        preguntas_repasos_media = Repaso.objects.values('pk').annotate(preguntas_len=(Count(F('partida__preguntas')))).aggregate(media=Avg(F('preguntas_len')))
        
        n_logs_repasos = Repaso.objects.values('partida__preguntas__acierto').annotate(numero=Count('pk'))

        # STATS EVENTOS
        n_eventos = Evento.objects.values('tema__nombre', 'idioma').annotate(numero=Count('pk'))
        media_valoracion_eventos = UserComp.objects.values('evento__name').annotate(media=Avg('valoracion'))

        media_puntos = UserComp.objects.values('evento__name').annotate(media=Avg('score'))
        preguntas_creadas = Pregunta.objects.values('evento__name').annotate(numero=Count('pk'))

        # STATS DUELOS
        n_duelos = Duelos.objects.values('partidaUser1__tema__nombre', 'partidaUser1__idioma').annotate(numero=Count('pk'))
        estado_duelos = Report.objects.values('estado').annotate(numero=Count('pk'))

        # TODO: Estadísticas de las valoraciones de cada pregunta

        return Response({
            'usuarios': n_users,
            'partidas totales': n_total_partidas,
            'reports totales': n_total_reports,
            'stats reports': reports,
            'preguntas totales': n_total_preguntas,
            'preguntas respondidas': preguntas_respondidas,
            'preguntas acertadas': preguntas_acertadas,
            'stats preguntas': preguntas,
            'partidas mes': partidas_mes,
            'preguntas mes': preguntas_mes,
            'reports mes': reports_mes,
            'porcentaje acierto': porcentaje_aciertos_medio,
            'repasos totales': n_repasos,
            'media de preguntas por repaso': preguntas_repasos_media['media'],
            'aciertos en repasos': n_logs_repasos,
            'eventos totales': n_eventos,
            'media valoracion eventos': media_valoracion_eventos,
            'media puntos evento': media_puntos,
            'preguntas creadas evento': preguntas_creadas,
            'duelos totales': n_duelos,
            'estado duelos': estado_duelos,
        })
    return Response({'error': 'Acceso restringido para los alumnos.'}, status=status.HTTP_403_FORBIDDEN)