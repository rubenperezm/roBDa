from rest_framework.serializers import ModelSerializer, SlugRelatedField

from apps.users.models import User
from apps.base.models import Duelos
from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer, PartidaReviewSerializer


class DuelosSerializer(ModelSerializer):
    partida = PartidaSerializer()
    # Cambiar como el tutorial
    user2 = SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all()
    )
    class Meta:
        model = Duelos
        fields = '__all__'

class DuelosListSerializer(DuelosSerializer):
    partida = PartidaListSerializer()
    class Meta:
        model = Duelos
        fields = '__all__'
    # TODO solo mostrar los duelos ya finalizados / rechazados
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user1': instance.user1.username,
            'user2': instance.user2.username,
            'partidaUser1': instance.partidaUser1,
            'partidaUser2': instance.partidaUser2,
            'score1': instance.score1,
            'score2': instance.score2,
            'estado': instance.get_estado_display(),
        }

class DuelosReviewSerializer(DuelosListSerializer):
    partida = PartidaReviewSerializer()
    class Meta:
        model = Duelos
        fields = '__all__'