# Generated by Django 4.1 on 2022-09-11 18:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_partida_idioma'),
    ]

    operations = [
        migrations.AlterField(
            model_name='duelos',
            name='partidaUser1',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='partida_retador', to='base.partida', verbose_name='Partida del retador'),
        ),
        migrations.AlterField(
            model_name='duelos',
            name='partidaUser2',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='partida_retado', to='base.partida', verbose_name='Partida del retado'),
        ),
        migrations.AlterField(
            model_name='repaso',
            name='partida',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='repaso', serialize=False, to='base.partida', verbose_name='Partida'),
        ),
        migrations.AlterField(
            model_name='usercomp',
            name='partida',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='participacion', serialize=False, to='base.partida', verbose_name='Partida'),
        ),
    ]
