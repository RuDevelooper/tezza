# Generated by Django 4.2.4 on 2025-02-15 10:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tezza', '0019_order_ordered_at_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='assembler',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='assembled_order_items', to=settings.AUTH_USER_MODEL, verbose_name='Сборщик'),
        ),
        migrations.AlterField(
            model_name='task',
            name='order_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='created_tasks', to='tezza.orderitem', verbose_name='Изделие из заказа'),
        ),
    ]
