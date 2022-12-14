# Generated by Django 4.1 on 2022-09-07 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_alter_partida_tema'),
    ]

    operations = [
        migrations.AlterField(
            model_name='duelos',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación'),
        ),
        migrations.AlterField(
            model_name='duelos',
            name='modified_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación'),
        ),
        migrations.AlterField(
            model_name='evento',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación'),
        ),
        migrations.AlterField(
            model_name='evento',
            name='modified_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación'),
        ),
        migrations.AlterField(
            model_name='partida',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación'),
        ),
        migrations.AlterField(
            model_name='partida',
            name='modified_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación'),
        ),
        migrations.AlterField(
            model_name='pregunta',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación'),
        ),
        migrations.AlterField(
            model_name='pregunta',
            name='modified_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación'),
        ),
        migrations.AlterField(
            model_name='report',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación'),
        ),
        migrations.AlterField(
            model_name='report',
            name='modified_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Fecha de Modificación'),
        ),
    ]
