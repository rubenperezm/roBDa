from django.utils import timezone
from django.db import models

from apps.users.models import User

class Tema(models.Model):
    class Meta:
        verbose_name = 'Tema'
        verbose_name_plural = 'Temas'
    
    nombre = models.CharField('Nombre del tema', max_length = 30, unique = True)
 
    def __str__(self):
        return self.nombre

class Idioma(models.IntegerChoices):
    ''' Clase de idiomas (a modo de enum) '''
    ESP = 1
    ING = 2

class Dispositivo(models.IntegerChoices):
    ''' Clase de dispositivos (a modo de enum) '''
    PC = 1
    MOVIL = 2
    TABLET = 3

class BaseModel(models.Model):
    """
    Modelo base del que heredan los modelos 
    de los que queremos saber fecha de creacion/modificacion
    """

    class Meta:
        """Meta definition for BaseModel."""
        abstract = True
    
    id = models.AutoField(primary_key = True)
    created_date = models.DateTimeField('Fecha de Creación', auto_now=False, auto_now_add=True)
    modified_date = models.DateTimeField('Fecha de Modificación', auto_now=True, auto_now_add=False)

# ---------------------------------------------------------------------------------------------------

class Imagen(models.Model):

    class Meta:
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imágenes'

    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    path = models.ImageField('Imagen Pregunta', upload_to='img/', unique = True)

    def __str__(self):
        return str(self.path)


class Evento(BaseModel):
    class Meta:
        verbose_name = 'Evento'
        verbose_name_plural = 'Eventos'

    name = models.CharField('Nombre', max_length=50, unique = True)
    fechaInicio = models.DateTimeField('Fecha de inicio del evento')
    finFase1 = models.DateTimeField('Fin de la fase de creación de pregunta')
    finFase2 = models.DateTimeField('Fin de la fase de cuestionarios')
    finFase3 = models.DateTimeField('Fin de la fase de reportar')
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
        elif now < self.finFase3.timestamp():
            return 'Ver resultados test'
        elif not self.terminada:
            return 'Esperando corrección del profesor'
        return 'Finalizada'

class Pregunta(BaseModel):
    class Meta:
        verbose_name = 'Pregunta'
        verbose_name_plural = 'Preguntas'
    
    class EstadoPregunta(models.Choices):
        EN_EVENTO = 1 # Pregunta en evento
        SIN_ELIMINAR = 2 # Pregunta fuera de evento, esté o no reportada
        ELIMINADA = 3 # Pregunta eliminada
        REPORTADA = 4 # Pregunta reportada

    creador = models.ForeignKey(User, on_delete = models.CASCADE, verbose_name = "Creador de la pregunta")
    imagen = models.ForeignKey(Imagen, on_delete = models.CASCADE, null = True, verbose_name = "Imagen")

    enunciado = models.CharField('Enunciado', max_length = 400)
    evento = models.ForeignKey(Evento, related_name = 'pregunta', on_delete = models.CASCADE, null = True, verbose_name = 'Evento en el que fue creada')
    estado = models.SmallIntegerField('Estado', choices = EstadoPregunta.choices, default = 1)
    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    idioma = models.SmallIntegerField('Idioma', choices = Idioma.choices, default = 1)
    dispositivo = models.SmallIntegerField('Dispositivo', choices = Dispositivo.choices, default = 1)

    def __str__(self):
        if len(self.enunciado) > 50:
            return f'{self.enunciado[:50]}...'
        else:
            return self.enunciado

class Opcion(models.Model):
    class Meta:
        verbose_name = 'Opción'
        verbose_name_plural = 'Opciones'
        #unique_together  = ('pregunta', 'texto')
    
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta", related_name="opciones")
    texto = models.CharField('Texto', max_length = 400)
    esCorrecta = models.BooleanField('Es correcta')

    def __str__(self):
        return self.texto

class Partida(BaseModel):
    class Meta:
        verbose_name = 'Partida'
        verbose_name_plural = 'Partidas'
    
    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema", null = True)
    idioma = models.SmallIntegerField('Idioma', choices = Idioma.choices, null = True)
    dispositivo = models.SmallIntegerField('Dispositivo', choices = Dispositivo.choices, default = 1)

    def __str__(self):
        return f'Partida {self.id}'

class AnswerLogs(models.Model):
    class Meta:
        verbose_name = "Respuesta individual"
        verbose_name_plural = "Respuestas individuales"

    partida = models.ForeignKey(Partida, on_delete = models.CASCADE, verbose_name = "Partida", related_name = 'preguntas')
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta")
    respuesta_user = models.ForeignKey(Opcion, on_delete = models.CASCADE, null = True, verbose_name = "Respuesta del usuario")
    timeIni = models.DateTimeField('Hora de inicio de la pregunta', auto_now_add = True)
    timeFin = models.DateTimeField('Hora de finalización de la pregunta', null = True)
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
    # TODO considerar hacer @property las puntuaciones de las tres fases
    #score_f1 = models.PositiveIntegerField('Puntuación de la fase de creación de pregunta', default = 0)
    #score_f2 = models.PositiveIntegerField('Puntuación de la fase de cuestionario', default = 0)
    #score_f3 = models.PositiveIntegerField('Puntuación de la fase de reportar', default = 0)
    valoracion = models.SmallIntegerField('Valoración', null = True)
    score = models.PositiveIntegerField('Puntuación', null = True)

    @property
    def score_f1(self):
        pregunta = Pregunta.objects.get(creador=self.user, evento=self.evento)
        if pregunta and (pregunta.estado == 1 or pregunta.estado == 2):
            if pregunta.imagen:
                return 50
            else:
                return 40
        else:
            return 0
    
    @property
    def score_f2(self):
        return self.partida.preguntas.filter(acierto = True).count() * 10

    @property
    def score_f3(self):
        # Si terminan la última fase, reciben 10 puntos extra
        if self.valoracion:
            return self.user.user_reports.filter(evento = self.pk, estado = 2).count() * 15 + 10
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
    
# TODO considerar esto
class MejoresValoradas(models.Model):
    class Meta:
        verbose_name = "Pregunta mejor valorada"
        verbose_name_plural = "Preguntas mejor valoradas"
        unique_together = ('evento', 'usuario')

    evento = models.ForeignKey(Evento, on_delete = models.CASCADE, verbose_name = "Evento")
    usuario = models.ForeignKey(User, on_delete = models.CASCADE, verbose_name = "Usuario")
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta")

class Report(BaseModel):
    class Meta:
        verbose_name = "Pregunta reportada"
        verbose_name_plural = "Preguntas reportadas"
        unique_together = ('reporter', 'pregunta')

    class MotivoReport(models.Choices):
        INCORRECTO = 1
        OFENSIVO = 2
        OTRO_MOTIVO = 3

    class EstadoReport(models.Choices):
        PENDIENTE = 1
        VALIDADO = 2
        INVALIDADO = 3

    reporter = models.ForeignKey(User, on_delete = models.CASCADE, verbose_name="Usuario que reporta", related_name="user_reports")
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta", related_name = "reports")
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, verbose_name="Evento", null = True)
    motivo = models.SmallIntegerField('Motivo', choices = MotivoReport.choices)
    descripcion = models.CharField('Descripción', max_length= 400)
    estado = models.SmallIntegerField('Estado', choices = EstadoReport.choices, default = 1)
    dispositivo = models.SmallIntegerField('Dispositivo', choices = Dispositivo.choices, default = 1)

    def __str__(self):
        return f'Report {self.id}'
        