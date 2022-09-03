from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from apps.users.models import User
from apps.users.api.serializers import (
    UserSerializer, UpdateUserSerializer,
    PasswordSerializer
)

class UserAPIView(APIView):
    def get(self, request):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)

    def put(self, request):
        user_serializer = UpdateUserSerializer(request.user, data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response({
                'message': 'Usuario actualizado correctamente'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'No se ha podido actualizar el usuario',
                'error': user_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        User.objects.filter(id=request.user.id).update(is_active=False)
        return Response({'message': 'Usuario eliminado correctamente'})

@api_view(['PUT'])
def set_password(request):
        user = request.user
        password_serializer = PasswordSerializer(data=request.data)
        if password_serializer.is_valid():
            user.set_password(password_serializer.validated_data['password'])
            user.save()
            return Response({
                'message': 'Contraseña actualizada correctamente'
            })
        return Response({
            'message': 'Hay errores en la información enviada',
            'error': password_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)