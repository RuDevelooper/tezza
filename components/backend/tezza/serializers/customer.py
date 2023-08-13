from rest_framework import serializers

from tezza import models


class Customer(serializers.ModelSerializer):

    class Meta:
        model = models.Customer
        fields = '__all__'
