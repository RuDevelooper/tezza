from rest_framework import serializers

from tezza import models


class Color(serializers.ModelSerializer):

    class Meta:
        model = models.Color
        fields = '__all__'


class Material(serializers.ModelSerializer):

    class Meta:
        model = models.Material
        fields = '__all__'


class Side(serializers.BaseSerializer):

    class Meta:
        model = serializers.CharField(source='get_side_display', required=True)
        fields = '__all__'


class Product(serializers.ModelSerializer):
    color = Color(many=False)
    material = Material(many=False)
    side = serializers.CharField(source='get_side_display', required=True)

    class Meta:
        model = models.Product
        fields = '__all__'
