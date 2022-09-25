from django.conf import settings
from apps.base.models import Opcion, Pregunta, Imagen
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from random import sample

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


def pregunta_aleatoria(partida, preguntas):
    contestadas = partida.preguntas.values_list('pregunta', flat=True)
    if len(contestadas) >= settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
        raise Exception("Ya se ha completado el cuestionario.")

    for pr in preguntas:
        if pr not in contestadas:
            return pr

def preguntas_user1(partida):
    filters = {
        "estado": 2
    }
    
    tema = partida.tema
    idioma = partida.idioma 
    
    if tema: filters['tema']  = tema
    if idioma: filters['idioma'] = idioma   

    preguntas = Pregunta.objects.filter(**filters)
    pks = preguntas.values_list('pk', flat = True)

    if len(preguntas) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
        raise Exception("No existen preguntas suficientes.")

    return sample(list(pks), settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO)

def preguntas_user2(partida):
    return partida.preguntas.values_list('pregunta', flat=True)




def preguntas_usercomp(usercomp):
        filters = {
            "evento": usercomp.evento,
        }

        preguntas = Pregunta.objects.exclude(creador = usercomp.user)
        preguntas_evento = preguntas.filter(**filters)

        pks = preguntas_evento.values_list('pk', flat = True)

        if len(preguntas) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
            raise Exception("No existen preguntas suficientes.")
        # Tomar preguntas del mazo 'bueno'
        elif len(pks) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
            otras_preguntas =  preguntas.filter(tema = usercomp.evento.tema, idioma = usercomp.evento.idioma).exclude(
                estado = 1, evento = usercomp.evento) # TODO es necesario evento?

            pks +=  otras_preguntas.values_list('pk', flat = True)
   
        return sample(list(pks), settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO)

