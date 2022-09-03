from rest_framework import serializers

from apps.base.models import Opcion, Pregunta, Tema



class OpcionSolucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ('texto', 'esCorrecta')
        

class OpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ('texto', 'esCorrecta')
        extra_kwargs = {
            'esCorrecta': {'write_only': True}
        }

class PreguntaSerializer(serializers.ModelSerializer):
    opciones = OpcionSerializer(many=True, read_only=False)
    tema = serializers.SlugRelatedField(
        slug_field='nombre',
        queryset=Tema.objects.all()
    )

    class Meta:
        model = Pregunta
        fields = '__all__'

    def validate_opciones(self, value):
        nCorrectas = 0
        for opcion in value:
            nCorrectas += opcion['esCorrecta']

        if nCorrectas != 1:
            raise serializers.ValidationError("Sólo debe haber una respuesta correcta")
        elif len(value) != 4:
            raise serializers.ValidationError("Sólo debe haber cuatro opciones")
        else:
            return value

    def create(self, validated_data):
        options_data = validated_data.pop('opciones')
        pregunta = self.Meta.model.objects.create(**validated_data)
        for option in options_data:
            Opcion.objects.create(pregunta=pregunta, **option)

        return pregunta