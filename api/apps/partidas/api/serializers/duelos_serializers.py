from rest_framework.serializers import ModelSerializer, StringRelatedField

from apps.base.models import Duelos
from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer, PartidaReviewSerializer


class DuelosSerializer(ModelSerializer):
    partida = PartidaSerializer()
    class Meta:
        model = Duelos
        fields = '__all__'

class DuelosListSerializer(DuelosSerializer):
    partida = PartidaListSerializer()
    class Meta:
        model = Duelos
        fields = '__all__'

class DuelosReviewSerializer(DuelosSerializer):
    user1 = StringRelatedField()
    user2 = StringRelatedField()
    partida = PartidaReviewSerializer()
    class Meta:
        model = Duelos
        fields = '__all__'