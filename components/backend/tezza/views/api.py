from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from tezza import models, serializers


class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """
    authentication_classes = TokenAuthentication,
    http_method_names = ('get',)
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.User

    def list(self, request):
        serializer = self.serializer_class(self.request.user)
        return Response(serializer.data)


class User(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.User

    queryset = models.User.objects.all()

class Color(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Color

    queryset = models.Color.objects.all()


class Material(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Material

    queryset = models.Material.objects.all()


class Product(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Product

    queryset = models.Product.objects.all()


class Customer(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Customer

    queryset = models.Customer.objects.all()


class Order(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.Order

    queryset = models.Order.objects.all()


class OrderItem(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderItem

    queryset = models.OrderItem.objects.all()


class OrderComment(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderComment

    queryset = models.OrderItem.objects.all()


class OrderLog(viewsets.ModelViewSet):
    authentication_classes = TokenAuthentication,
    permission_classes = {
        permissions.IsAuthenticated,
    }
    serializer_class = serializers.OrderLog

    queryset = models.OrderLog.objects.all()
