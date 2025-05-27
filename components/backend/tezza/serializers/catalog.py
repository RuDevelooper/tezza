from rest_framework import serializers

from tezza import models


class Color(serializers.ModelSerializer):

    class Meta:
        model = models.Color
        fields = '__all__'
        read_only_fields = ['id', 'title']


class Material(serializers.ModelSerializer):

    class Meta:
        model = models.Material
        fields = '__all__'
        read_only_fields = ['id', 'title']


class Side(serializers.BaseSerializer):

    class Meta:
        model = serializers.CharField(source='get_side_display', required=True)
        fields = '__all__'


class Product(serializers.ModelSerializer):
    color_obj = Color(source='color', read_only=True)
    material_obj = Material(source='material', read_only=True)
    side_repr = serializers.CharField(source='get_side_display', read_only=True)

    class Meta:
        model = models.Product
        fields = '__all__'
        extra_kwargs = {
            'sku': {
                'validators': []
            }
        }
