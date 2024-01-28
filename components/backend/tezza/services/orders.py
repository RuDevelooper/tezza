from _decimal import Decimal
from datetime import datetime
from typing import Any, List

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

    # @validate_call
    @transaction.atomic
    def create(self, **kwargs):
        # with transaction.atomic():
        order_data = Order(**kwargs)
        customer, created = models.Customer.objects.get_or_create(
            organisation=order_data.customer.organisation,
            name=order_data.customer.name,
            address=order_data.customer.address,
            phone=order_data.customer.phone,
        )
        order, created = models.Order.objects.get_or_create(
            number=order_data.number,
            due_date=order_data.due_date,
            created_by=order_data.created_by,
            customer=customer,
            products_cost=order_data.products_cost,
            delivery_cost=order_data.delivery_cost,
            total_cost=order_data.total_cost,
        )

        order_items = []
        for item in order_data.items:
            color = models.Color.objects.get(
                title=item.product.color.get('title')
            )
            material = models.Material.objects.get(
                title=item.product.material.get('title')
            )
            product = models.Product.objects.get(sku=item.product.sku)
            if not product:
                product, created = models.Product.objects.get_or_create(
                    sku=item.product.sku,
                    title=item.product.title,
                    color=color,
                    material=material,
                    side=item.product.get_side_display,
                )

            order_item = models.OrderItem.objects.create(
                order=order,
                product=product,
                price=item.price,
            )
            order_items.append(order_item)

        return order
