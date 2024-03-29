# Generated by Django 4.1 on 2023-06-18 14:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('preguntas', '0001_initial'),
        ('eventos', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Partida',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')),
                ('modified_date', models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación')),
                ('idioma', models.SmallIntegerField(choices=[(1, 'Esp'), (2, 'Ing')], verbose_name='Idioma')),
                ('tema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='preguntas.tema', verbose_name='Tema')),
            ],
            options={
                'verbose_name': 'Partida',
                'verbose_name_plural': 'Partidas',
            },
        ),
        migrations.CreateModel(
            name='Duelos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')),
                ('modified_date', models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación')),
                ('estado', models.SmallIntegerField(choices=[(1, 'En Creacion'), (2, 'Pendiente'), (3, 'Finalizado'), (4, 'Rechazado'), (5, 'Aceptado')], default=1, verbose_name='Estado')),
                ('partidaUser1', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='partida_retador', to='partidas.partida', verbose_name='Partida del retador')),
                ('partidaUser2', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='partida_retado', to='partidas.partida', verbose_name='Partida del retado')),
                ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retador', to=settings.AUTH_USER_MODEL, verbose_name='Usuario retador')),
                ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retado', to=settings.AUTH_USER_MODEL, verbose_name='Usuario retado')),
            ],
            options={
                'verbose_name': 'Duelo',
                'verbose_name_plural': 'Duelos',
            },
        ),
        migrations.CreateModel(
            name='AnswerLogs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')),
                ('modified_date', models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación')),
                ('timeIni', models.DateTimeField(null=True, verbose_name='Hora de inicio de la pregunta')),
                ('timeFin', models.DateTimeField(null=True, verbose_name='Hora de finalización de la pregunta')),
                ('acierto', models.BooleanField(null=True, verbose_name='Acierto')),
                ('reportada', models.BooleanField(default=False, verbose_name='Reportada')),
                ('partida', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='preguntas', to='partidas.partida', verbose_name='Partida')),
                ('pregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='preguntas.pregunta', verbose_name='Pregunta')),
                ('respuesta', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='preguntas.opcion', verbose_name='Opción seleccionada')),
            ],
            options={
                'verbose_name': 'Respuesta individual',
                'verbose_name_plural': 'Respuestas individuales',
            },
        ),
        migrations.CreateModel(
            name='UsuarioPregunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('historico', models.FloatField(default=0.5, verbose_name='Historico')),
                ('espaciado', models.FloatField(default=0, verbose_name='Espaciado')),
                ('pregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pregunta_usuario', to='preguntas.pregunta', verbose_name='Pregunta')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario_pregunta', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Usuario pregunta',
                'verbose_name_plural': 'Usuarios preguntas',
                'unique_together': {('user', 'pregunta')},
            },
        ),
        migrations.CreateModel(
            name='UserComp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valoracion', models.SmallIntegerField(null=True, verbose_name='Valoración')),
                ('score', models.PositiveIntegerField(null=True, verbose_name='Puntuación')),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='eventos.evento', verbose_name='Evento')),
                ('partida', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='participacion', to='partidas.partida', verbose_name='Partida')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participante', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Participación en evento',
                'verbose_name_plural': 'Participaciones en eventos',
                'unique_together': {('evento', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Repaso',
            fields=[
                ('partida', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='repaso', serialize=False, to='partidas.partida', verbose_name='Partida')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Repaso',
                'verbose_name_plural': 'Repasos',
            },
        ),
    ]
