# Generated by Django 4.2.4 on 2024-10-09 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tezza', '0007_designer_orderitem_assembled_at_order_designer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='assembled_at',
            field=models.DateTimeField(null=True, verbose_name='Дата и время завершения сборки'),
        ),
    ]