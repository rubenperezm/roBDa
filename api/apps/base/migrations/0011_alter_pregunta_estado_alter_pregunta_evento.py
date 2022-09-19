# Generated by Django 4.1 on 2022-09-17 16:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_duelos_partidauser1_alter_duelos_partidauser2_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pregunta',
            name='estado',
            field=models.SmallIntegerField(choices=[(1, 'En Evento'), (2, 'Sin Eliminar'), (3, 'Eliminada'), (4, 'Reportada')], default=1, verbose_name='Estado'),
        ),
        migrations.AlterField(
            model_name='pregunta',
            name='evento',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='evento', to='base.evento', verbose_name='Evento en el que fue creada'),
        ),
    ]