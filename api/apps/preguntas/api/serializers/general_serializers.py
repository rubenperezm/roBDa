from rest_framework import serializers

from apps.preguntas.models import Tema, Imagen
       
class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = '__all__'

class ImagenSerializer(serializers.ModelSerializer):
    tema = serializers.SlugRelatedField(
        slug_field='nombre',
        queryset=Tema.objects.all()
    )
    class Meta:
        model = Imagen
        fields = '__all__'