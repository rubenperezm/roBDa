from rest_framework import serializers

from apps.base.models import Tema
       
class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = ('nombre',)