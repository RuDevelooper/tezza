from rest_framework import serializers

from tezza import models, services
from tezza.serializers import Customer, Product


class User(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )
    class Meta:
        model = models.User
        fields = (
            "id",
            "first_name",
            "last_name",
            "groups",
        )


class OrderItem(serializers.ModelSerializer):
    service = services.Orders()
    status_name = serializers.CharField(source='get_status_display', required=False)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False)
    product = Product()
    order_num = serializers.CharField(source='order.number', read_only=True)

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


class UserFullName(serializers.RelatedField):
    queryset = models.User.objects.all()
    def to_representation(self, value):
        return '%s %s' % (value.first_name, value.last_name)

class OrderItemSimple(serializers.ModelSerializer):
    status = serializers.CharField(source='get_status_display', required=False)
    product = serializers.SlugRelatedField(slug_field='sku', queryset=models.Product.objects.all())
    assembler = UserFullName()

    class Meta:
        model = models.OrderItem
        fields = '__all__'


class OrderSimple(serializers.ModelSerializer):
    service = services.Orders()

    designer = serializers.SlugRelatedField(slug_field='name', queryset=models.Designer.objects.all())
    assembler = UserFullName()
    created_by = UserFullName()
    picker = UserFullName()
    customer = Customer(many=False)
    items = OrderItemSimple(many=True)
    priority = serializers.CharField(
        source='get_priority_display',
        required=False,
    )
    status_name = serializers.CharField(
        source='get_status_display',
        required=False,
    )
    delivery_payer_name = serializers.CharField(
        source='get_delivery_payer_display',
        required=False,
    )

    class Meta:
        model = models.Order
        fields = '__all__'



class Order(serializers.ModelSerializer):
    service = services.Orders()

    assembler = User()
    created_by= User()
    picker = User()
    designer = Designer()
    customer = Customer(many=False)
    items = OrderItem(many=True)
    priority = serializers.CharField(source='get_priority_display',
                                     required=False,)
    status_name = serializers.CharField(source='get_status_display', required=False,)
    delivery_payer_name = serializers.CharField(source='get_delivery_payer_display', required=False,)

    class Meta:
        model = models.Order
        fields = '__all__'

    def create(self, data):
        return self.service.create(**data)


class OrderLog(serializers.ModelSerializer):
    class Meta:
        model = models.OrderLog
        fields = '__all__'
