from rest_framework import permissions

class esProfeOSoloLectura(permissions.BasePermission):
    message = 'Un alumno no tiene permisos suficientes para realizar esta acción'

    def has_permission(self, request, view):
        return (request.user.is_staff or (request.user.is_active and request.method in permissions.SAFE_METHODS))

class isNotStaff(permissions.BasePermission):
    message = 'Esta acción solo está disponible para alumnos'

    def has_permission(self, request, view):
        return not permissions.IsAdminUser.has_permission(self, request, view)

