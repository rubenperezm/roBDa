# Generated by Django 4.1 on 2022-09-19 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_remove_usercomp_score_f1_remove_usercomp_score_f2_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='partida',
            name='dispositivo',
            field=models.SmallIntegerField(choices=[(1, 'Pc'), (2, 'Movil'), (3, 'Tablet')], default=1, verbose_name='Dispositivo'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pregunta',
            name='dispositivo',
            field=models.SmallIntegerField(choices=[(1, 'Pc'), (2, 'Movil'), (3, 'Tablet')], default=1, verbose_name='Dispositivo'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='report',
            name='dispositivo',
            field=models.SmallIntegerField(choices=[(1, 'Pc'), (2, 'Movil'), (3, 'Tablet')], default=1, verbose_name='Dispositivo'),
            preserve_default=False,
        ),
    ]