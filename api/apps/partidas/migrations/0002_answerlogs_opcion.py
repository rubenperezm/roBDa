# Generated by Django 4.1 on 2023-04-04 11:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('preguntas', '0001_initial'),
        ('partidas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answerlogs',
            name='opcion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='preguntas.opcion', verbose_name='Opción seleccionada'),
        ),
    ]