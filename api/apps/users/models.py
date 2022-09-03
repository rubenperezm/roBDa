from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
 
class UserManager(BaseUserManager):
    def _create_user(self, username, email, password, is_staff, is_superuser, **extra_fields):
        user = self.model(
            username = username,
            email = email,
            is_staff = is_staff,
            is_superuser = is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, username, email,  password=None, **extra_fields):
        return self._create_user(username, email, password, False, False, **extra_fields)

    def create_superuser(self, username, email, password=None, **extra_fields):
        return self._create_user(username, email, password, True, True, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    username = models.CharField('Nombre de Usuario', max_length = 30, unique = True)
    email = models.EmailField('Correo Electrónico', max_length = 50, unique = True)
    is_active = models.BooleanField('Está activo',default = True)
    is_staff = models.BooleanField('Es profesor', default = False)
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        name = self.username
        if self.is_staff:
            name = 'profesor ' + name
        return name