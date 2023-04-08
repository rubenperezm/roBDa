from django.contrib import admin

from apps.preguntas.models import Pregunta, Tema, Imagen



admin.site.register(Pregunta)
admin.site.register(Tema)
admin.site.register(Imagen)
