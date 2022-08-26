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

'''
class UserViewSet(viewsets.GenericViewSet):
    model = User
    serializer_class = UserSerializer
    list_serializer_class = UserListSerializer
    queryset = None

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        if self.queryset is None:
            self.queryset = self.model.objects\
                            .filter(is_active=True)\
                            .values('id', 'username', 'email')
        return self.queryset

    @action(detail=True, methods=['post'])
    def set_password(self, request):
        user = self.get_object()
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

    # El metodo list sera un retrieve de la propia informacion
    @action(detail=True, methods=['get'])
    def my_profile(self, request):
        user = self.get_object()
        print(request.user.id)
        user_serializer = self.serializer_class(user)
        return Response(user_serializer.data)

    @action(detail=True, methods=['put'])
    def update_profile(self, request):
        user = self.get_object()
        user_serializer = UpdateUserSerializer(user, data=request.data)
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

    @action(detail=True, methods=['delete'])
    def delete_profile(self, request):   
            user_destroy = self.get_object().update(is_active=False)
            if user_destroy == 1:
                return Response({
                    'message': 'Usuario eliminado correctamente'
                    })

'''