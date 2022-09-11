from rest_framework import serializers

from apps.base.models import Idioma, Imagen, Opcion, Pregunta, Tema



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
            raise serializers.ValidationError("Debe haber exactamente una respuesta correcta")
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

class PreguntaResueltaSerializer(PreguntaSerializer):
    opciones = OpcionSolucionSerializer(many=True, read_only=False)
    tema = None
    class Meta:
        model = Pregunta
        exclude = ('id', 'created_date', 'modified_date', 'estado', 'evento', 'creador', 'tema', 'idioma')

class PreguntaListSerializer(PreguntaResueltaSerializer):
    enunciado = serializers.StringRelatedField()
    creador = serializers.StringRelatedField()
    tema = serializers.StringRelatedField()
    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'enunciado', 'tema', 'idioma', 'estado', 'created_date', 'modified_date')

class PreguntaRetrieveSerializer(PreguntaListSerializer):
    imagen = serializers.StringRelatedField()
    evento = serializers.StringRelatedField()
    class Meta:
        model = Pregunta
        fields = '__all__'