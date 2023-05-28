from django.db import models
from django.conf import settings
from apps.users.models import User
from apps.base.models import BaseModel
from apps.preguntas.models import Pregunta, Tema, Idioma
from apps.eventos.models import Evento

class Partida(BaseModel):
    class Meta:
        verbose_name = 'Partida'
        verbose_name_plural = 'Partidas'
    
    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    idioma = models.SmallIntegerField('Idioma', choices = Idioma.choices)

    @property
    def porcentaje_acierto(self):
        return round(AnswerLogs.objects.filter(partida = self, acierto = True).count() 
                     / AnswerLogs.objects.filter(partida = self).count(), 2)
    
    @property # timeFin de la ultima pregunta menos timeIni de la primera ordenadas cronologicamente
    def tiempo(self):
        if self.preguntas.count() == 0:
            return 0
        return (self.preguntas.last().timeFin - self.preguntas.first().timeIni).total_seconds()


    def __str__(self):
        return f'Partida {self.id}'

class AnswerLogs(BaseModel):
    class Meta:
        verbose_name = "Respuesta individual"
        verbose_name_plural = "Respuestas individuales"

    partida = models.ForeignKey(Partida, on_delete = models.CASCADE, verbose_name = "Partida", related_name = 'preguntas')
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta")
    respuesta = models.ForeignKey('preguntas.Opcion', on_delete = models.CASCADE, verbose_name = "Opción seleccionada", null=True)
    timeIni = models.DateTimeField('Hora de inicio de la pregunta', null=True)
    timeFin = models.DateTimeField('Hora de finalización de la pregunta', null=True)
    acierto = models.BooleanField('Acierto', null = True)

    def __str__(self):
        return f'Registro {self.id}'

                
class Duelos(BaseModel):
    class Meta:
        verbose_name = "Duelo"
        verbose_name_plural = "Duelos"

    class EstadoDuelo(models.Choices):
        EN_CREACION = 1
        PENDIENTE = 2
        FINALIZADO = 3
        RECHAZADO = 4
        ACEPTADO = 5

    partidaUser1 = models.OneToOneField(Partida, related_name = 'partida_retador', on_delete = models.CASCADE, verbose_name = "Partida del retador")
    partidaUser2 = models.OneToOneField(Partida, related_name = 'partida_retado', on_delete = models.CASCADE, null = True, verbose_name = "Partida del retado")
    user1 = models.ForeignKey(User, related_name = 'retador', on_delete = models.CASCADE, verbose_name = 'Usuario retador')
    user2 = models.ForeignKey(User, related_name = 'retado', on_delete = models.CASCADE, verbose_name = 'Usuario retado')
    estado = models.SmallIntegerField('Estado', choices = EstadoDuelo.choices, default = 1)


    @property
    def score1(self):
        return self.partidaUser1.preguntas.filter(acierto = True).count()
    
    @property
    def score2(self):
        return self.partidaUser2.preguntas.filter(acierto = True).count() if self.partidaUser2 else 0

    @property
    def resultado(self):
        if self.score1 > self.score2:
            return 'VICTORIA'
        elif self.score1 == self.score2:
            return 'EMPATE'
        else:
            return 'DERROTA'
            
    def __str__(self):
        return f'Duelo {self.id}: {self.user1.id} vs. {self.user2.id}'

class UserComp(models.Model):

    class Meta:
        verbose_name = "Participación en evento"
        verbose_name_plural = "Participaciones en eventos"
        unique_together = ('evento', 'user')

    partida = models.OneToOneField(Partida, related_name = 'participacion',on_delete = models.CASCADE, verbose_name = "Partida", primary_key = True)
    user = models.ForeignKey(User, related_name = 'participante', on_delete = models.CASCADE, verbose_name = 'Usuario')
    evento = models.ForeignKey(Evento, on_delete = models.CASCADE, verbose_name = "Evento")
    valoracion = models.SmallIntegerField('Valoración', null = True)
    score = models.PositiveIntegerField('Puntuación', null = True)

    @property
    def score_f1(self):
        pregunta = Pregunta.objects.get(creador=self.user, evento=self.evento)
        if pregunta and pregunta.created_date == pregunta.modified_date:
            return 50
        else:
            return 0
    
    @property
    def score_f2(self):
        return self.partida.preguntas.filter(acierto = True).count() * 10

    @property
    def score_f3(self):
        # Si terminan la última fase, reciben 20 puntos extra
        if self.valoracion:
            return self.user.user_reports.filter(evento = self.pk, estado = 2).count() * 15 + 20
        else:
            return self.user.user_reports.filter(evento = self.pk, estado = 2).count() * 15

    def __str__(self):
        return f'Participación {self.partida}'

class Repaso(models.Model):
    class Meta:
        verbose_name = "Repaso"
        verbose_name_plural = "Repasos"

    partida = models.OneToOneField(Partida, related_name = 'repaso',on_delete = models.CASCADE, verbose_name = "Partida", primary_key = True)
    user = models.ForeignKey(User, related_name = 'usuario', on_delete = models.CASCADE, verbose_name = 'Usuario')


class UsuarioPregunta(models.Model):
    class Meta:
        verbose_name = "Usuario pregunta"
        verbose_name_plural = "Usuarios preguntas"
        unique_together = ('user', 'pregunta')

    user = models.ForeignKey(User, related_name = 'usuario_pregunta', on_delete = models.CASCADE, verbose_name = 'Usuario')
    pregunta = models.ForeignKey(Pregunta, related_name = 'pregunta_usuario', on_delete = models.CASCADE, verbose_name = 'Pregunta')
    historico = models.FloatField('Historico', default = 0.5)
    espaciado = models.FloatField('Espaciado', default = 0.5)

    @property
    def idoneidad(self):
        # TODO: Si la valoración percibida coincide con la estimada, cambiar la fórmula
        #return (settings.VALOR_ALPHA*self.pregunta.valoracionMedia + self.historico) * (1 - self.espaciado)
        return self.historico * (1 - self.espaciado)

    def __str__(self):
        return f'Usuario pregunta {self.id}'