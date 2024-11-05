from rest_framework import serializers

from tezza import models
from tezza.serializers import User, OrderItem


class AssemblerTask(serializers.ModelSerializer):
    # service = services.Orders()

    assembler_user = User(source='assembler', read_only=True)
    master_user = User(source='created_by', read_only=True)
    items = OrderItem(many=True)
    status_name = serializers.CharField(source='get_status_display', required=False)
    work_type_name = serializers.CharField(source='get_work_type_name_display', required=False)

    class Meta:
        model = models.Task
        fields = '__all__'
    #
    # def create(self, data):
    #     return self.service.create(**data)