# Generated by Django 4.2.4 on 2024-10-11 08:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tezza', '0012_alter_designer_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='discount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5, verbose_name='Скидка'),
        ),
    ]