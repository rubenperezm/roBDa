from rest_framework.serializers import ModelSerializer

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from apps.base.models import AnswerLogs, Partida

class AnswerLogsSerializer(ModelSerializer):
    pregunta = PreguntaSerializer()
    class Meta:
        model = AnswerLogs
        fields = '__all__'

class PartidaSerializer(ModelSerializer):
    preguntas = AnswerLogsSerializer(many=True, read_only=True)
    class Meta:
        model = Partida
        fields = '__all__'