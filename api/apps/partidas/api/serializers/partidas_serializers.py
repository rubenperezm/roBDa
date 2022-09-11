from rest_framework.serializers import ModelSerializer, StringRelatedField, ReadOnlyField

from apps.preguntas.api.serializers.preguntas_serializers import PreguntaResueltaSerializer
from apps.base.models import AnswerLogs, Partida, Repaso

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
            'tema': instance.tema.nombre if instance.tema else 'Todos'
        }

class RepasoSerializer(ModelSerializer):
    partida = PartidaSerializer()
    class Meta:
        model = Repaso
        fields = '__all__'

class RepasoListSerializer(RepasoSerializer):
    partida = PartidaListSerializer()
    class Meta:
        model = Repaso
        fields = '__all__'

class RepasoReviewSerializer(RepasoSerializer):
    usuario = StringRelatedField()
    partida = PartidaReviewSerializer()
    class Meta:
        model = Repaso
        fields = '__all__'
