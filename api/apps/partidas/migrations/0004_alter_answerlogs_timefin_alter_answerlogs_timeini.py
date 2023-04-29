# Generated by Django 4.1 on 2023-04-05 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partidas', '0003_rename_opcion_answerlogs_respuesta'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answerlogs',
            name='timeFin',
            field=models.DateTimeField(null=True, verbose_name='Hora de finalización de la pregunta'),
        ),
        migrations.AlterField(
            model_name='answerlogs',
            name='timeIni',
            field=models.DateTimeField(null=True, verbose_name='Hora de inicio de la pregunta'),
        ),
    ]