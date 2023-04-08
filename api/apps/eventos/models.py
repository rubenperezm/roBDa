from apps.base.models import BaseModel
from apps.preguntas.models import Tema, Idioma
from django.db import models
from django.utils import timezone

class Evento(BaseModel):
    class Meta:
        verbose_name = 'Evento'
        verbose_name_plural = 'Eventos'

    name = models.CharField('Nombre', max_length=50, unique = True)
    fechaInicio = models.DateTimeField('Fecha de inicio del evento')
    finFase1 = models.DateTimeField('Fin de la fase de creación de pregunta')
    finFase2 = models.DateTimeField('Fin de la fase de cuestionarios')
    # finFase3 = models.DateTimeField('Fin de la fase de reportar')
    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    idioma = models.SmallIntegerField('Idioma', choices = Idioma.choices, default = 1)
    terminada = models.BooleanField('Evento terminado', default = False)

    def __str__(self):
        return self.name

    @property
    def fase_actual(self):
        now = timezone.now().timestamp()
        if now < self.fechaInicio.timestamp():
            return 'No ha comenzado'
        elif now < self.finFase1.timestamp():
            return 'Crear preguntas'
        elif now < self.finFase2.timestamp():
            return 'Realizar test'
        # elif now < self.finFase3.timestamp():
        #     return 'Ver resultados test'
        elif not self.terminada:
            return 'Esperando corrección del profesor'
        return 'Finalizada'
    
    @property
    def mejores_jugadores(self):
        partidas = self.partida_set.all().order_by('-puntuacion')
        if len(partidas) < 5:
            return partidas
        return partidas[:5]