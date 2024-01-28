from rest_framework import serializers

from tezza import models, services
from tezza.serializers import Customer, Product


class User(serializers.ModelSerializer):

    class Meta:
        model = models.User
        fields = (
            "id",
            "first_name",
            "last_name",
        )


class OrderItem(serializers.ModelSerializer):
    status_name = serializers.CharField(source='get_status_display', required=False)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False)
    product = Product(many=False)

    class Meta:
        model = models.OrderItem
        fields = '__all__'


class OrderComment(serializers.ModelSerializer):
    user = User(many=False, read_only=True)

    class Meta:
        model = models.OrderComment
        fields = '__all__'


class Order(serializers.ModelSerializer):
    service = services.Orders()

    assembler = User(many=False, read_only=True)
    comments = OrderComment(many=True, read_only=True)
    customer = Customer(many=False)
    items = OrderItem(many=True)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False)
    status = serializers.CharField(source='get_status_display', required=False)

    class Meta:
        model = models.Order
        fields = '__all__'

    def create(self, data):

        return self.service.create(**data)


class OrderLog(serializers.ModelSerializer):

    class Meta:
        model = models.OrderLog
        fields = '__all__'
