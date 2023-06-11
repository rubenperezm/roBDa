from django.conf import settings
from django.db.models import F, Case, When
from apps.partidas.models import UsuarioPregunta
from apps.preguntas.models import Opcion, Pregunta, Imagen
from apps.preguntas.api.serializers.general_serializers import ImagenSerializer
from apps.preguntas.api.serializers.preguntas_serializers import PreguntaSerializer
from random import sample, shuffle
import numpy as np

def preguntaToJSON(pk, pk_log):
        preg_serial = PreguntaSerializer(Pregunta.objects.get(pk=pk))

        data = {
                "id_log": pk_log,
                "enunciado": preg_serial.data["enunciado"],
                "opciones": preg_serial.data["opciones"],
            }
        shuffle(data["opciones"])
        try:
            img = Imagen.objects.get(pk = preg_serial.data["imagen"])
            img_serial = ImagenSerializer(img)
            data["imagen"] =  img_serial.data["path"]
        except:
            pass
        return data

def preguntas_to_JSON(pks):
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pks)])
    preguntas = Pregunta.objects.filter(pk__in=pks).order_by(preserved)

    preg_serial = PreguntaSerializer(preguntas, many=True)
    data = []
    for p in preg_serial.data:
        pregunta = {
            "id": p["id"],
            "enunciado": p["enunciado"],
            "opciones": p["opciones"],
        }
        shuffle(pregunta["opciones"])
        try:
            img = Imagen.objects.get(pk = p["imagen"])
            img_serial = ImagenSerializer(img)
            pregunta["imagen"] =  img_serial.data["path"]
        except:
            pass
        data.append(pregunta)
    return data

def esAcierto(pregunta, respuesta):
    if respuesta:
        return respuesta == Opcion.objects.get(pregunta = pregunta.id, esCorrecta=True)
    return None


def pregunta_aleatoria(partida):
    filters = {
        "estado": 2,
        "tema": partida.tema,
        "idioma": partida.idioma,
    }

    pks = Pregunta.objects.filter(**filters).values_list('pk', flat = True)

    if len(pks) == 0:
        raise Exception("No existen preguntas suficientes.")

    # Obtener preguntas contestadas por el usuario y sus idoneidades
    preguntas_contestadas = UsuarioPregunta.objects.filter(user=partida.repaso.user, pregunta__in=pks).values_list('pregunta', 'historico')
    preguntas_dict = dict(preguntas_contestadas)

    # TODO: Al no usar el factor dificultad percibida (valoracion_media) de cada pregunta, podemos poner 0.5 directamente
    idoneidad_preguntas = np.array([preguntas_dict.get(pk, 0.5) for pk in pks])

    pregunta_seleccionada = np.random.choice(pks, size=1, replace=False, p=idoneidad_preguntas/np.sum(idoneidad_preguntas))


    UsuarioPregunta.objects.filter(user=partida.repaso.user, pregunta__in=pks).exclude(pregunta=pregunta_seleccionada[0]).update(espaciado=F('espaciado')*settings.VALOR_FACTOR_ESPACIADO)
    UsuarioPregunta.objects.update_or_create(user=partida.repaso.user, pregunta=Pregunta.objects.get(pk=pregunta_seleccionada[0]), defaults={'historico': 0.5, 'espaciado': 1})
    
    return pregunta_seleccionada[0]

def preguntas_user1(partida):
    filters = {
        "estado": 2,
        "tema": partida.tema,
        "idioma": partida.idioma,
    }

    preguntas = Pregunta.objects.filter(**filters)
    pks = preguntas.values_list('pk', flat = True)

    if len(pks) < settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO:
        raise Exception("No existen preguntas suficientes.")
    else:
        seleccionadas = sample(list(pks), settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO)
        return preguntas_to_JSON(seleccionadas)

def preguntas_user2(partida):
    return preguntas_to_JSON(partida.preguntas.order_by(F('timeIni').asc(nulls_last=True)).values_list('pregunta', flat=True))



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
            otras_preguntas =  preguntas.filter(tema = usercomp.evento.tema, idioma = usercomp.evento.idioma, estado = 2)\
                .exclude(creador = usercomp.user)

            # TODO: Si por ejemplo hay 1000 preguntas en el mazo 'bueno' y 2 creadas,
            # la selección debe ser esas 2 más 8 aleatorias, no 10 aleatorias
            pks +=  otras_preguntas.values_list('pk', flat = True)
   
        seleccionadas = sample(list(pks), settings.NUMERO_DE_PREGUNTAS_POR_CUESTIONARIO)
        return preguntas_to_JSON(seleccionadas)

