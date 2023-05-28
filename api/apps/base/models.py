from django.db import models

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
        