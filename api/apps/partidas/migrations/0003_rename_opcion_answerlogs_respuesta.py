# Generated by Django 4.1 on 2023-04-04 11:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('partidas', '0002_answerlogs_opcion'),
    ]

    operations = [
        migrations.RenameField(
            model_name='answerlogs',
            old_name='opcion',
            new_name='respuesta',
        ),
    ]