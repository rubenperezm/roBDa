from rest_framework import serializers

from apps.base.models import Opcion, Pregunta, Report, Tema



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

    def update(self, instance, validated_data):
        options_data = validated_data.pop('opciones')
        pregunta = super().update(instance, validated_data)
        textos_incorrectos = [x['texto'] for x in options_data if x['esCorrecta'] == False]

        correcta = instance.opciones.filter(esCorrecta=True).first()
        opciones_modificables = list(instance.opciones.filter(esCorrecta = False).exclude(texto__in = textos_incorrectos).values_list('pk', flat=True))
        textos_no_modificables = list(instance.opciones.filter(esCorrecta = False, texto__in = textos_incorrectos).values_list('texto', flat=True))
        print(opciones_modificables)
        for option in options_data:
            if option['esCorrecta'] == True:
                if correcta.texto != option['texto']:
                    correcta.texto = option['texto']
                    correcta.save()
            else:
                if option['texto'] not in textos_no_modificables:
                    aux = Opcion.objects.get(pk=opciones_modificables[-1])
                    opciones_modificables.pop()
                    aux.texto = option['texto']
                    aux.save()

        return pregunta

class PreguntaResueltaSerializer(PreguntaSerializer):
    opciones = OpcionSolucionSerializer(many=True)
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
            'enunciado': instance.__str__(),
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'creada': instance.created_date,
            'modificada': instance.modified_date,
            'notificaciones': instance.reports.filter(estado = 1).count(),
        }

class PregutaConReportsSerializer(PreguntaResueltaSerializer):
    class Meta:
        model = Pregunta
        fields = ('id', 'creador', 'imagen', 'enunciado', 'tema', 'idioma')
    
    def to_representation(self, instance):
        reports = instance.reports.filter(estado = 1)
        reports_serial = ReportReviewSerializer(reports, many = True)
        return {
            'id': instance.id,
            'creador': instance.creador.username,
            'imagen': instance.imagen.path if instance.imagen else None,
            'enunciado': instance.enunciado,
            'tema': instance.tema.nombre,
            'idioma': instance.get_idioma_display(),
            'creada': instance.created_date,
            'modificada': instance.modified_date,
            'notificaciones': reports_serial.data,
        }