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
    service = services.Orders()
    status_name = serializers.CharField(source='get_status_display', required=False)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False)
    product = Product()

    class Meta:
        model = models.OrderItem
        fields = '__all__'
        read_only_fields = ['order', 'product']

    def update(self, instance, validated_data):
        # super().update(instance, validated_data)

        self.service.check_order_after_item_update(instance, validated_data)
        return instance


class OrderComment(serializers.ModelSerializer):
    user = User(many=False, read_only=True)

    class Meta:
        model = models.OrderComment
        fields = '__all__'


class Designer(serializers.ModelSerializer):
    class Meta:
        model = models.Designer
        fields = '__all__'


class Order(serializers.ModelSerializer):
    service = services.Orders()

    assembler_user = User(source='assembler', read_only=True)
    manager_user = User(source='created_by', read_only=True)
    picker_user = User(source='picker', read_only=True)
    designer_user = Designer(source='designer', read_only=True)
    customer = Customer(many=False)
    items = OrderItem(many=True)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False)
    status_name = serializers.CharField(source='get_status_display', required=False)

    class Meta:
        model = models.Order
        fields = '__all__'

    def create(self, data):
        return self.service.create(**data)


class OrderLog(serializers.ModelSerializer):
    class Meta:
        model = models.OrderLog
        fields = '__all__'
