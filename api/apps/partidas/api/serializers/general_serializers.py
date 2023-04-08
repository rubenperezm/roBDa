from rest_framework.serializers import ModelSerializer, StringRelatedField, ReadOnlyField

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaResueltaSerializer
from apps.partidas.models import AnswerLogs, Partida

class AnswerLogsSerializer(ModelSerializer):
    pregunta = PreguntaResueltaSerializer()
    class Meta:
        model = AnswerLogs
        exclude = ('id', 'partida')

class AnswerLogsRetrieveSerializer(AnswerLogsSerializer):
    respuesta_user = StringRelatedField()
    acierto = ReadOnlyField()

class PartidaSerializer(ModelSerializer):
    preguntas = AnswerLogsSerializer(many=True, read_only=True)
    class Meta:
        model = Partida
        fields = '__all__'

class PartidaReviewSerializer(ModelSerializer):
    preguntas = AnswerLogsRetrieveSerializer(many=True, read_only=True)
    class Meta:
        model = Partida
        fields = ('preguntas',)

class PartidaListSerializer(ModelSerializer):
    class Meta:
        model = Partida
        exclude = ('created_date', 'modified_date')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'idioma': instance.get_idioma_display() if instance.idioma else 'Esp Ing',
            'tema': instance.tema.nombre if instance.tema else 'Todos',
            'porcentajeAcierto': instance.porcentaje_aciertos,
            'tiempo': instance.tiempo,
        }