from django.db import models


class Customer(models.Model):
    organisation = models.CharField(
        max_length=100,
        verbose_name="ИП / ООО",
    )
    name = models.CharField(
        max_length=100,
        verbose_name="ФИО покупателя",
    )
    address = models.CharField(
        max_length=100,
        verbose_name="Адрес доставки",
    )
    phone = models.CharField(
        max_length=15,
        verbose_name="Телефон",
    )

    class Meta:
        ordering = ["name"]
        verbose_name = 'Покупатель'
        verbose_name_plural = 'Покупатели'

    def __str__(self):
        return self.name
