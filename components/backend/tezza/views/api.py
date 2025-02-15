from typing import Dict, List

from rest_framework import viewsets, permissions, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination

from django_filters.rest_framework import DjangoFilterBackend

from tezza import models, serializers


class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    authentication_classes = (TokenAuthentication,)
    http_method_names = ("get",)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.User

    def list(self, request):
        serializer = self.serializer_class(self.request.user)
        return Response(serializer.data)


class User(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.User

    queryset = models.User.objects.all()


class Color(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Color

    queryset = models.Color.objects.all()


class Designer(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Designer

    queryset = models.Designer.objects.all()


class Material(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Material

    queryset = models.Material.objects.all()


class Side(viewsets.ViewSetMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Side
    queryset = models.Product.Side


class Product(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Product

    filter_backends = [filters.SearchFilter]
    search_fields = [
        "sku",
    ]

    queryset = models.Product.objects.all()


class Customer(viewsets.ModelViewSet):
    #     authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Customer

    queryset = models.Customer.objects.all()


class Order(viewsets.ModelViewSet):
    #     authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    # pagination_class = PageNumberPagination
    # serializer_class = serializers.Order

    def get_serializer_class(self):
        if hasattr(self, "action") and self.action == 'list':
            return serializers.OrderSimple

        return serializers.Order

    filterset_fields: dict[str, list[str]] = {
        "status": ["in", "exact"],  # note the 'in' field
        "number": ["exact"],
    }

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    queryset = models.Order.objects.all().prefetch_related('items', 'items__product').select_related(
        "created_by",
        "customer",
        "assembler",
        "picker",
        "designer",
    )
    ordering = "-created_at"
    ordering_fields = ["created_at", "due_date"]

    # def get_queryset(self):
    #     return self.request.user.accounts.all()


class OrderItem(viewsets.ModelViewSet):
    #     authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderItem
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {
        "status": ("in", "exact"),  # note the 'in' field
        "order__assembler": ("exact",),
        "assembled_at": ("gte", "lte", "exact", "gt", "lt"),
    }
    ordering_fields = ["assembled_at", "added_at"]
    ordering = ("-added_at",)
    queryset = models.OrderItem.objects.all()


class OrderComment(viewsets.ModelViewSet):
    #     authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderComment

    queryset = models.OrderItem.objects.all()


class OrderLog(viewsets.ModelViewSet):
    #     authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderLog

    queryset = models.OrderLog.objects.all()


class AssemblerTask(viewsets.ModelViewSet):
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.AssemblerTask
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {
        "status": ("in", "exact"),  # note the 'in' field
        "order__assembler": ("exact",),
        "completed_at": ("gte", "lte", "exact", "gt", "lt"),
    }
    ordering_fields = ["completed_at", "created_at"]
    ordering = ("-created_at",)
    queryset = models.Task.objects.all()
