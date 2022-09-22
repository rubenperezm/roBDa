from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny

from apps.users.api.serializers import UserSerializer, PasswordSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['esProfesor'] = user.is_staff
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class Register(GenericAPIView):
    permission_classes = [AllowAny,]
    serializer_class = UserSerializer
    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception = True)
        psswd_serializer = PasswordSerializer(data = request.data)
        psswd_serializer.is_valid(raise_exception = True)

        serializer.create(serializer.validated_data)
        return Response({'message': 'Usuario registrado correctamente.'}, status = status.HTTP_201_CREATED)


class Logout(GenericAPIView):
    serializer_class = UserSerializer
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh', ''))
            token.blacklist()
            return Response({'message': 'Sesión cerrada correctamente.'})
        except: 
            return Response({'error': 'El token no es válido'}, status = status.HTTP_401_UNAUTHORIZED)