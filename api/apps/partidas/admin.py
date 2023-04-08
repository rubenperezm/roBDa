from django.contrib import admin

from apps.partidas.models import AnswerLogs, Partida, UsuarioPregunta

# Register your models here.
admin.site.register(Partida)
admin.site.register(AnswerLogs)
admin.site.register(UsuarioPregunta)