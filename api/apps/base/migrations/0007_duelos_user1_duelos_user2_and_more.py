# Generated by Django 4.1 on 2022-09-10 20:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0006_remove_partida_preguntas_alter_answerlogs_partida'),
    ]

    operations = [
        migrations.AddField(
            model_name='duelos',
            name='user1',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='retador', to=settings.AUTH_USER_MODEL, verbose_name='Usuario retador'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='duelos',
            name='user2',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='retado', to=settings.AUTH_USER_MODEL, verbose_name='Usuario retado'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='opcion',
            unique_together={('pregunta', 'texto')},
        ),
    ]
