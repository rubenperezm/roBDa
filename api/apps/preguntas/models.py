from apps.base.models import BaseModel
from apps.users.models import User
from django.db import models

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

class Imagen(models.Model):

    class Meta:
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imágenes'

    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    path = models.ImageField('Imagen Pregunta', upload_to='img/', unique = True)
    nombre = models.CharField('Nombre de la imagen', max_length = 30, unique = True)

    def __str__(self):
        return str(self.path)
    
class Pregunta(BaseModel):
    class Meta:
        verbose_name = 'Pregunta'
        verbose_name_plural = 'Preguntas'
    
    class EstadoPregunta(models.Choices):
        EN_EVENTO = 1 # Pregunta en evento
        ACTIVA = 2 # Pregunta fuera de evento
        ELIMINADA = 3 # Pregunta eliminada
        REPORTADA = 4 # Pregunta reportada

    creador = models.ForeignKey(User, on_delete = models.CASCADE, verbose_name = "Creador de la pregunta")
    imagen = models.ForeignKey(Imagen, on_delete = models.CASCADE, null = True, verbose_name = "Imagen")
    enunciado = models.CharField('Enunciado', max_length = 400)
    evento = models.ForeignKey("eventos.Evento", related_name = 'pregunta', on_delete = models.CASCADE, null = True, verbose_name = 'Evento en el que fue creada')
    estado = models.SmallIntegerField('Estado', choices = EstadoPregunta.choices, default = 1)
    tema = models.ForeignKey(Tema, on_delete = models.CASCADE, verbose_name = "Tema")
    idioma = models.SmallIntegerField('Idioma', choices = Idioma.choices, default = 1)
    nValorada = models.IntegerField('Número de veces valorada', default = 0)
    valoracionAcumulada = models.IntegerField('Valoración acumulada', default = 0)

    @property
    def valoracionMedia(self):
        if self.nValorada == 0:
            return 5 # Máxima valoración
        return round(self.valoracionAcumulada / self.nValorada, 2)

    def __str__(self):
        if len(self.enunciado) > 50:
            return f'{self.enunciado[:50]}...'
        else:
            return self.enunciado

class Opcion(models.Model):
    class Meta:
        verbose_name = 'Opción'
        verbose_name_plural = 'Opciones'
    
    pregunta = models.ForeignKey(Pregunta, on_delete = models.CASCADE, verbose_name = "Pregunta", related_name="opciones")
    texto = models.CharField('Texto', max_length = 400)
    esCorrecta = models.BooleanField('Es correcta')

    def __str__(self):
        return self.texto
    
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
    evento = models.ForeignKey("eventos.Evento", on_delete=models.CASCADE, verbose_name="Evento", null = True)
    motivo = models.SmallIntegerField('Motivo', choices = MotivoReport.choices)
    descripcion = models.CharField('Descripción', max_length= 400)
    estado = models.SmallIntegerField('Estado', choices = EstadoReport.choices, default = 1)

    def __str__(self):
        return f'Report {self.id}'