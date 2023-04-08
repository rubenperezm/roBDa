# Generated by Django 4.1 on 2023-04-02 09:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('eventos', '0001_initial'),
        ('preguntas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='evento',
            name='tema',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='preguntas.tema', verbose_name='Tema'),
        ),
    ]
