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


class Product(serializers.ModelSerializer):

    class Meta:
        model = models.Product
        fields = '__all__'
