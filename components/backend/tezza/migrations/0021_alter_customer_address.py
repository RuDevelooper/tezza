# Generated by Django 4.2.4 on 2025-02-15 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tezza', '0020_orderitem_assembler_alter_task_order_item'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='address',
            field=models.CharField(max_length=255, verbose_name='Адрес доставки'),
        ),
    ]
