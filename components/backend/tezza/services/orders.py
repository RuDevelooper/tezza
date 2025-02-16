from _decimal import Decimal
from datetime import datetime
from typing import Any, List, Callable

from django.db import transaction
from pydantic import BaseModel, Field

from tezza import models


class Customer(BaseModel):
    organisation: str
    name: str
    address: str
    phone: str


class Product(BaseModel):
    sku: str
    title: str
    get_side_display: str
    color: Any
    material: Any


class OrderItem(BaseModel):
    # priority: str
    product: Product
    price: Decimal


class Order(BaseModel):
    number: str
    customer: Customer
    created_at: datetime
    due_date: datetime
    products_cost: Decimal
    delivery_cost: Decimal
    total_cost: Decimal
    created_by: Any
    items: List[OrderItem] = Field(default_factory=list)


class Orders:

    @transaction.atomic
    def create(self, **kwargs):
        order_items = kwargs.pop('items')
        customer = kwargs.pop('customer')
        customer, created = models.Customer.objects.get_or_create(**customer)
        order = models.Order.objects.create(
            customer=customer,
            **kwargs
        )
        order.change_status(status=models.Order.Status.NEW)

        for item in order_items:
            product_data = item.pop('product')
            product = models.Product.objects.get(**product_data)
            models.OrderItem.objects.create(
                order=order,
                product=product,
                **item,
            )

        return order

    @transaction.atomic
    def check_order_after_item_update(self, instance: models.OrderItem, validated_data):
        instance.__dict__.update(**validated_data)
        instance.save()

        status = validated_data.get('status')
        if status == 'assembled':
            instance.assembled_at = datetime.utcnow()
            instance.save()
            if instance.order.status == models.Order.Status.ASSEMBLY:
                order = instance.order
                if all(i.status == models.OrderItem.Status.ASSEMBLED for i in order.items.all()):
                    order.assembling_end = datetime.utcnow()
                    order.change_status(models.Order.Status.ASSEMBLED)

                order.save()
