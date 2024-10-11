from datetime import datetime

from django.contrib.auth.models import User
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _

from .catalog import Product
from .customer import Customer

User.__str__ = lambda user: f'{user.first_name} {user.last_name}'


class Designer(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='Имя',
    )

    class Meta:
        verbose_name = 'Дизайнер'
        verbose_name_plural = 'Дизайнеры'

    def __str__(self):
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', _('Новый')
        WAIT_PAYMENT = 'wait_payment', _('Ожидает оплаты')
        PAYED = 'payed', _('Оплачен')
        ASSEMBLY = 'assembly', _('Сборка')
        ASSEMBLED = 'assembled', _('Собран')
        COLORING = 'coloring', _('Покраска')
        PICKING = 'packing', _('Упаковка')
        SHIPPED = 'shipped', _('Отправлен')
        COMPLETED = 'completed', _('Завершен')

    class Priority(models.TextChoices):
        LOW = 'low', _('Низкий')
        NORMAL = 'normal', _('Обычный')
        HIGH = 'high', _('Высокий')

    number = models.CharField(
        max_length=100,
        verbose_name='Номер',
    )
    created_at = models.DateTimeField(
        default=datetime.utcnow,
        verbose_name='Создан',
    )
    due_date = models.DateTimeField(
        default=datetime.utcnow,
        verbose_name='Плановая отгрузка',
    )
    created_by = models.ForeignKey(
        to=User,
        related_name='created_orders',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Кто создал',
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL,
        verbose_name='Приоритет',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name='Статус',
    )
    customer = models.ForeignKey(
        to=Customer,
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Покупатель',
    )
    products_cost = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        verbose_name='Стоимость товаров',
        default=0,
    )
    delivery_cost = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        verbose_name='Стоимость доставки',
        default=0,
        blank=True,
    )
    delivery_tracking_number = models.CharField(
        max_length=20,
        verbose_name='Трек номер доставки',
        null=True,
        blank=True,
    )
    comment_for_manager = models.CharField(
        max_length=255,
        verbose_name='Комментарий для менеджера',
        null=True,
        blank=True,
    )
    comment_for_assembler = models.CharField(
        max_length=255,
        verbose_name='Комментарий для сборщика',
        null=True,
        blank=True,
    )
    comment_for_picker = models.CharField(
        max_length=255,
        verbose_name='Комментарий для упаковщика',
        null=True,
        blank=True,
    )
    total_cost = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        verbose_name='Полная стоимость',
    )
    discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name='Скидка',
    )
    assembling_start = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Начало сборки',
    )
    assembling_end = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Завершение сборки',
    )
    assembler = models.ForeignKey(
        to=User,
        related_name='assembled_orders',
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        verbose_name='Сборщик',
    )
    picked_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Упакован',
    )
    shipped_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Отправлен',
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Завершен',
    )
    picker = models.ForeignKey(
        to=User,
        related_name='picked_orders',
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        verbose_name='Упаковщик',
    )
    designer = models.ForeignKey(
        to=Designer,
        related_name='designer',
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        verbose_name='Дизайнер',
    )

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return self.number

    def change_status(self, status: Status):
        with transaction.atomic():
            OrderLog.objects.create(
                event=f"Статус: '{status}'",
                order=self,
                status=status,
            )
            self.status = status

    def change_priority(self, priority: Priority):
        with transaction.atomic():
            OrderLog.objects.create(
                event=f"Приоритет: '{priority.value}'",
                order=self,
                status=self.status,
            )
            self.priority = priority


class OrderLog(models.Model):
    order = models.ForeignKey(
        to=Order,
        null=False,
        on_delete=models.CASCADE,
        verbose_name='Заказ',
    )
    status = models.CharField(
        max_length=20,
        choices=Order.Status.choices,
        verbose_name='Статус заказа',
    )
    event = models.CharField(
        max_length=100,
        verbose_name='Событие',
    )
    added_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['added_at']
        verbose_name = 'Событие по заказу'
        verbose_name_plural = 'События по заказам'

    def __str__(self):
        return self.event


class OrderComment(models.Model):
    order = models.ForeignKey(
        to=Order,
        null=False,
        related_name='comments',
        on_delete=models.CASCADE,
        verbose_name='Заказ',
    )
    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name='Комментарий',
    )
    user = models.ForeignKey(
        to=User,
        related_name='comments',
        null=True,
        on_delete=models.PROTECT,
        verbose_name='Пользователь',
    )
    added_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['added_at']
        verbose_name = 'Комментарии по заказу'
        verbose_name_plural = 'Комментарии по заказам'

    def __str__(self):
        return self.comment


class OrderItem(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', _('Новый')
        CUT = 'cut', _('Резка')
        ASSEMBLY = 'assembly', _('Сборка')
        ASSEMBLED = 'assembled', _('Собран')
        COLORING = 'coloring', _('Покраска')

    class Priority(models.TextChoices):
        LOW = 'low', _('Низкий')
        NORMAL = 'normal', _('Обычный')
        HIGH = 'high', _('Высокий')

    order = models.ForeignKey(
        to=Order,
        related_name='items',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Заказ',
    )
    product = models.ForeignKey(
        to=Product,
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Изделие',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name='Статус',
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL,
        verbose_name='Приоритет',
    )
    price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        verbose_name='Цена',
    )
    assembled_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата и время завершения сборки',
    )
    added_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата и время добавления изделия',
    )

    class Meta:
        ordering = ['order']
        verbose_name = 'Изделие в заказе'
        verbose_name_plural = 'Изделия в заказах'

    def __str__(self):
        return f'Заказ {self.order.number} | {self.product.title}'


class MonthlyPlan(models.Model):

    year = models.IntegerField(
        null=False,
        verbose_name='Год',
    )
    month = models.IntegerField(
        null=False,
        verbose_name='Месяц',
    )
    items = models.IntegerField(
        null=False,
        default=0,
        verbose_name='Количество изделий',
    )
    added_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата и время создания плана',
    )

    class Meta:
        ordering = ['-added_at']
        verbose_name = 'План на месяц'
        verbose_name_plural = 'Планы на месяц'

    def __str__(self):
        return f'План на {self.year} г. {self.month} месяц.'
