from rest_framework import serializers

from apps.base.models import Evento, Tema

class EventoSerializer(serializers.ModelSerializer):
    tema = serializers.SlugRelatedField(
        slug_field='nombre',
        queryset=Tema.objects.all()
    )
    class Meta:
        model = Evento
        exclude = ('created_date', 'modified_date')
    