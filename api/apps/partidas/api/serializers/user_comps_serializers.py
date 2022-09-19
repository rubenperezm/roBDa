from rest_framework.serializers import ModelSerializer, StringRelatedField

from apps.base.models import UserComp
from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer, PartidaReviewSerializer


class UserCompSerializer(ModelSerializer):
    partida = PartidaSerializer()
    class Meta:
        model = UserComp
        fields = '__all__'

class UserCompListSerializer(UserCompSerializer):
    partida = PartidaListSerializer()
    user = StringRelatedField()
    evento = StringRelatedField()
    
    class Meta:
        model = UserComp
        fields = ('partida', 'user', 'evento', 'score')


class UserCompReviewSerializer(UserCompSerializer):
    user = StringRelatedField()
    evento = StringRelatedField()
    partida = PartidaReviewSerializer()

    class Meta:
        model = UserComp
        fields = ('user', 'evento', 'partida', 'score_f1', 'score_f2', 'score_f3', 'valoracion')