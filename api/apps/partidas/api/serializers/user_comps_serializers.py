from rest_framework.serializers import ModelSerializer, StringRelatedField
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaResueltaSerializer

from apps.partidas.models import UserComp
from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer, PartidaReviewSerializer


class UserCompSerializer(ModelSerializer):
    partida = PartidaSerializer()
    class Meta:
        model = UserComp
        fields = '__all__'

class UserCompListSerializer(UserCompSerializer):
    user = StringRelatedField()
    evento = StringRelatedField()
    
    class Meta:
        model = UserComp
        fields = ('id', 'user', 'evento', 'score')


class UserCompReviewSerializer(UserCompSerializer):
    user = StringRelatedField()
    partida = PartidaReviewSerializer()

    class Meta:
        model = UserComp
        fields = ('id', 'user', 'evento', 'partida', 'score_f1', 'score_f2', 'score_f3', 'valoracion')