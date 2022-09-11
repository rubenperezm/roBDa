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
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'fechaInicio': instance.fechaInicio,
            'finFase1': instance.finFase1,
            'finFase2': instance.finFase2,
            'finFase3': instance.finFase3,
            'terminada': instance.terminada,
        }
class EventoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ('id', 'name', 'tema', 'idioma', 'fase_actual')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'fase_actual': instance.fase_actual
        }