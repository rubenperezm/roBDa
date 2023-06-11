from rest_framework import serializers
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.preguntas.models import Opcion, Pregunta, Report, Tema



# class OpcionSolucionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Opcion
#         fields = ('texto', 'esCorrecta')
        

class OpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ('id', 'texto', 'esCorrecta')

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class ReportReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        exclude = ('estado', 'pregunta')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.reporter.username,
            'motivo': instance.get_motivo_display(),
            'descripcion': instance.descripcion,
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
        textos = set(x['texto'] for x in value)
        if len(textos) != len(value):
            raise serializers.ValidationError("No puede haber opciones repetidas")
        elif len(value) != 4:
            raise serializers.ValidationError("Sólo debe haber cuatro opciones")

        for opcion in value:
            nCorrectas += opcion['esCorrecta']

        if nCorrectas != 1:
            raise serializers.ValidationError("Debe haber exactamente una respuesta correcta")
        else:
            return value

    def create(self, validated_data):
        options_data = validated_data.pop('opciones')
        pregunta = self.Meta.model.objects.create(**validated_data)
        
        for option in options_data:
            Opcion.objects.create(pregunta=pregunta, **option)

        return pregunta

class PreguntaResueltaSerializer(PreguntaSerializer):
    opciones = OpcionSerializer(many=True)
    imagen = ImagenSerializer()
    tema = None

    class Meta:
        model = Pregunta
        exclude = ('created_date', 'modified_date', 'estado', 'evento', 'creador', 'tema', 'idioma')


class PreguntaListSerializer(PreguntaResueltaSerializer):
    tema = serializers.StringRelatedField()
    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'enunciado', 'tema', 'idioma', 'estado', 'evento', 'created_date', 'modified_date')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'creador': instance.creador.username,
            'enunciado': instance.__str__(),
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'estado': instance.get_estado_display(),
            'evento': instance.evento.name if instance.evento else None,
            'creada': instance.created_date,
            'modificada': instance.modified_date,
            'notificaciones': instance.reports.filter(estado = 1).count(),
        }

class PreguntaConReportsSerializer(PreguntaResueltaSerializer):

    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'imagen', 'enunciado', 'tema', 'idioma')   
    
    def to_representation(self, instance):
        reports = instance.reports.filter(estado = 1)
        reports_serial = ReportReviewSerializer(reports, many = True)
        opciones_serial = OpcionSerializer(instance.opciones.all(), many=True)
        image_serial = ImagenSerializer(instance.imagen) if instance.imagen else None
        return {
            'id': instance.id,
            'creador': instance.creador.username,
            'imagen': image_serial.data if instance.imagen else None,
            'enunciado': instance.enunciado,
            'tema': instance.tema.nombre,
            'idioma': instance.idioma,
            'creada': instance.created_date,
            'modificada': instance.modified_date,
            'valoracion': instance.valoracionMedia,
            'reports': reports_serial.data,
            'opciones': opciones_serial.data,
        }