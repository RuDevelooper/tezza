from _decimal import Decimal
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class Customer(BaseModel):
    organisation: str
    name: str
    address: str
    phone: str


class Product(BaseModel):
    # id:
    sku: str
    title: str
    side: str
    size: Decimal
    price: Decimal
    color: str
    material: str


class OrderItem(BaseModel):
    priority: str
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
    items: Any


class Orders:

    # @validate_call
    def create(self, **kwargs):
        order = Order(**kwargs)

        return
