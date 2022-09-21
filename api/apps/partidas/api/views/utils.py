from apps.base.models import Opcion, Pregunta, Imagen
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer

def preguntaToJSON(pk, pk_log):
        preg_serial = PreguntaSerializer(Pregunta.objects.get(pk=pk))
        data = {
                "id_log": pk_log,
                "enunciado": preg_serial.data["enunciado"],
                "opciones": preg_serial.data["opciones"],
            }
        try:
            img = Imagen.objects.get(pk = preg_serial.data["imagen"])
            img_serial = ImagenSerializer(img)
            data["imagen"] =  img_serial.data["path"]
        except:
            pass
        return data

def esAcierto(log, respuesta):
    if respuesta:
        return respuesta == Opcion.objects.get(pregunta = log.pregunta.id, esCorrecta=True).texto