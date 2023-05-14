from django.utils import timezone
from rest_framework import serializers

from apps.eventos.models import Evento
from apps.preguntas.models import Tema, Report

class EventoSerializer(serializers.ModelSerializer):
    tema = serializers.SlugRelatedField(
        slug_field='nombre',
        queryset=Tema.objects.all()
    )
    class Meta:
        model = Evento
        exclude = ('created_date', 'modified_date')

    def validate(self, data):
        if data['fechaInicio'] < data['finFase1'] < data['finFase2']: #< data['finFase3']:
            return data
        raise serializers.ValidationError(
            {'fechas':'Las fechas deben ser coherentes.'}
        )
    
    def create(self, validated_data):
        if timezone.now() < validated_data.get('fechaInicio'):
            evento = super().create(validated_data)
            return evento
        raise serializers.ValidationError(
            {'fechas':'Las fechas deben ser coherentes.'}
        )

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'fechaInicio': instance.fechaInicio,
            'finFase1': instance.finFase1,
            'finFase2': instance.finFase2,
            'ranking': instance.ranking,
            'terminada': instance.terminada,
            'terminable': instance.terminable,
        }
class EventoStudentSerializer(EventoSerializer):
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'fechaInicio': instance.fechaInicio,
            'finFase1': instance.finFase1,
            'finFase2': instance.finFase2,
            'mejoresJugadores': instance.mejores_jugadores,
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