from rest_framework.serializers import ModelSerializer, SlugRelatedField

from apps.users.models import User
from apps.partidas.models import Duelos
# from apps.partidas.api.serializers.general_serializers import PartidaSerializer, PartidaListSerializer

class DuelosSerializer(ModelSerializer):
    user2 = SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all()
    )
    class Meta:
        model = Duelos
        fields = '__all__'

class DuelosListStudentSerializer(DuelosSerializer):
    class Meta:
        model = Duelos
        fields = '__all__'
    
    def to_representation(self, instance):
        data = {
            'id': instance.id,
            'user1': instance.user1.username,
            'user2': instance.user2.username,
            'tema': instance.partidaUser1.tema.nombre if instance.partidaUser1.tema else 'Todos',
            'idioma': instance.partidaUser1.get_idioma_display() if instance.partidaUser1.idioma else 'Esp Ing',
            'estado': instance.get_estado_display()
        }
        if instance.estado == 3:
            data['score1'] = instance.score1
            data['score2'] = instance.score2
            # TODO: Ver si es necesario enviar el resultado o si desde Next se calcula
            data['resultado'] = instance.resultado
        return data

class DuelosListSerializer(DuelosSerializer):
    class Meta:
        model = Duelos
        fields = '__all__'
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user1': instance.user1.username,
            'user2': instance.user2.username,
            'tema': instance.partidaUser1.tema.nombre if instance.partidaUser1.tema else 'Todos',
            'idioma': instance.partidaUser1.get_idioma_display() if instance.partidaUser1.idioma else 'Esp Ing',
            'score1': instance.score1,
            'score2': instance.score2,
            'estado': instance.get_estado_display(),
        }

class DuelosReviewSerializer(DuelosSerializer):

    class Meta:
        model = Duelos
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user1': instance.user1.username,
            'user2': instance.user2.username,
            'tema': instance.partidaUser1.tema.nombre if instance.partidaUser1.tema else 'Todos',
            'idioma': instance.partidaUser1.get_idioma_display() if instance.partidaUser1.idioma else 'Esp Ing',
            'score1': instance.score1,
            'score2': instance.score2,
            'estado': instance.get_estado_display(),
        }