from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate
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
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class Register(GenericAPIView):
    permission_classes = [AllowAny,]
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        psswd_serializer = PasswordSerializer(data = request.data)
        psswd_serializer.is_valid(raise_exception = True)

        serializer.create(serializer.validated_data)
        return Response({'message': 'Usuario registrado correctamente.'}, status = status.HTTP_201_CREATED)

'''
class Login(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(username=username, password=password)

        if user:
            login_serializer = self.serializer_class(data=request.data)
            if login_serializer.is_valid():
                user_serializer = UserSerializer(user)
                return Response({
                    'token': login_serializer.validated_data.get('access'),
                    'refresh-token': login_serializer.validated_data.get('refresh'),
                    'user': user_serializer.data,
                    'message': 'Inicio de Sesión Existoso'
                })
        return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
'''

class Logout(GenericAPIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh', ''))
            token.blacklist()
            return Response({'message': 'Sesión cerrada correctamente.'})
        except: 
            return Response({'error': 'El token no es válido'}, status = status.HTTP_401_UNAUTHORIZED)