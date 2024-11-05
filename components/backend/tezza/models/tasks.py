from datetime import datetime

from django.contrib.auth.models import User
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _

from .orders import OrderItem
from .catalog import Product


class Task(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', _('Новый')
        COMPLETED = 'completed', _('Завершен')

    class WorkType(models.TextChoices):
        ASSEMBLING = 'assembling', _('Сборка')
        GRINDING = 'grinding', _('Шлифовка')

    created_at = models.DateTimeField(
        default=datetime.utcnow,
        verbose_name='Создан',
    )
    due_date = models.DateTimeField(
        default=datetime.utcnow,
        verbose_name='Дедлайн',
    )
    order_item = models.ForeignKey(
        to=OrderItem,
        related_name='created_tasks',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Изделие из заказа',
    )
    created_by = models.ForeignKey(
        to=User,
        related_name='created_tasks',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Кто создал',
    )
    work_type = models.CharField(
        max_length=20,
        choices=WorkType.choices,
        verbose_name='Тип работ',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name='Статус',
    )
    assembler = models.ForeignKey(
        to=User,
        related_name='assembly_tasks',
        on_delete=models.PROTECT,
        verbose_name='Сборщик',
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Завершен',
    )

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Задание на сборку'
        verbose_name_plural = 'Задания на сборку'

    def __str__(self):
        return f'{self.order_item.order.number} | {self.order_item.product.sku} | {self.work_type}'

