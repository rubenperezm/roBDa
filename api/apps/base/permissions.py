from rest_framework import permissions
from datetime import datetime

from apps.base.models import Evento, Pregunta

class esProfeOSoloLectura(permissions.BasePermission):
    message = 'Un alumno no tiene permisos suficientes para realizar esta acción'

    def has_permission(self, request, view):
        return (request.user.is_staff or request.method in permissions.SAFE_METHODS)

class preguntaPermission(permissions.BasePermission):
    message = 'Sólo puede crearse una pregunta por evento, y debe de hacerse en la primera fase'

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        elif not request.data.get('evento') or request.method != 'POST':
            return False
        else:
            competicion = Evento.objects.get(pk=request.data.get('evento'))
            pregunta = Pregunta.objects.filter(creador=request.user.id).filter(evento=competicion.id)
            return ((datetime.now().timestamp() <= competicion.finFase1.timestamp()) and not pregunta)

class isNotStaff(permissions.BasePermission):
    message = 'Esta acción solo está disponible para alumnos'

    def has_permission(self, request, view):
        return not permissions.IsAdminUser

class reportPermission(permissions.BasePermission):
    message = 'Los report solo puede crearlos un alumno en la tercera fase de una competición'

    def has_permission(self, request, view):
        # TODO hacer lo que sea necesario
        return True
