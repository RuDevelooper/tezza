from django.db import models
from django.utils.translation import gettext_lazy as _


class Color(models.Model):
    title = models.CharField(
        max_length=60,
        verbose_name='Название',
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'

    def __str__(self):
        return self.title


class Material(models.Model):
    title = models.CharField(
        max_length=60,
        verbose_name='Название',
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'

    def __str__(self):
        return self.title


class Product(models.Model):

    class Side(models.TextChoices):
        LEFT = 'L', _('Левый')
        RIGHT = 'R', _('Правый')

    sku = models.CharField(
        max_length=100,
        verbose_name='Артикул',
        blank=True,
    )
    title = models.CharField(
        max_length=100,
        verbose_name='Наименование',
    )
    color = models.ForeignKey(
        to=Color,
        related_name='products',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Цвет',
    )
    material = models.ForeignKey(
        to=Material,
        related_name='products',
        null=False,
        on_delete=models.PROTECT,
        verbose_name='Материал',
    )
    side = models.CharField(
        max_length=8,
        choices=Side.choices,
        default=Side.LEFT,
        verbose_name='Сторона',
        null=True,
    )
    side_point = models.CharField(
        max_length=100,
        verbose_name='Признак для стороны',
        blank=True,
        null=True,
    )
    size = models.IntegerField(
        default=0,
        verbose_name='Размер, см',
        null=True,
    )
    price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        default=0,
        verbose_name='Цена',
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'Изделие'
        verbose_name_plural = 'Изделия'

    def __str__(self):
        return self.title
