from rest_framework import serializers

from apps.base.models import Idioma, Imagen, Opcion, Pregunta, Report, Tema



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

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class ReportReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        exclude = ('dispositivo', 'estado', 'pregunta')


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
    opciones = OpcionSolucionSerializer(many=True, read_only=False) # TODO es necesario el read_only al final?
    tema = None
    class Meta:
        model = Pregunta
        exclude = ('created_date', 'modified_date', 'estado', 'evento', 'creador', 'tema', 'idioma', 'dispositivo')

class PreguntaListSerializer(PreguntaResueltaSerializer):
    tema = serializers.StringRelatedField()
    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'enunciado', 'tema', 'idioma', 'estado', 'created_date', 'modified_date')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'creador': instance.creador.username,
            'enunciado': instance.enunciado,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'creada': instance.created_date,
            'modificada': instance.modified_date,
            'veces_reportada': instance.reports.count(),
        }

class PregutaConReportsSerializer(PreguntaListSerializer):
    reports = ReportReviewSerializer(many = True)
    imagen = serializers.StringRelatedField()
    evento = serializers.StringRelatedField()
    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'imagen', 'enunciado', 'evento', 'estado', 'tema', 'idioma', 'dispositivo', 'reports')