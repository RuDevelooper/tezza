# Generated by Django 4.2.4 on 2024-01-27 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tezza', '0004_product_side_point'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='size',
            field=models.IntegerField(default=0, null=True, verbose_name='Размер, см'),
        ),
    ]
