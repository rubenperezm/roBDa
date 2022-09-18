from rest_framework.serializers import ModelSerializer, StringRelatedField

from apps.base.models import Repaso
from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer, PartidaReviewSerializer


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
