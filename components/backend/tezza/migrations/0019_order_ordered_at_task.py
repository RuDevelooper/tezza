# Generated by Django 4.2.4 on 2024-10-27 08:11

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tezza', '0018_order_comment_for_sender_product_size2_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='ordered_at',
            field=models.DateTimeField(default=datetime.datetime.utcnow, verbose_name='Дата заказа'),
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=datetime.datetime.utcnow, verbose_name='Создан')),
                ('due_date', models.DateTimeField(default=datetime.datetime.utcnow, verbose_name='Дедлайн')),
                ('work_type', models.CharField(choices=[('assembling', 'Сборка'), ('grinding', 'Шлифовка')], max_length=20, verbose_name='Тип работ')),
                ('status', models.CharField(choices=[('new', 'Новый'), ('completed', 'Завершен')], default='new', max_length=20, verbose_name='Статус')),
                ('completed_at', models.DateTimeField(blank=True, null=True, verbose_name='Завершен')),
                ('assembler', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='assembly_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Сборщик')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='created_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Кто создал')),
                ('order_item', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='created_tasks', to='tezza.orderitem', verbose_name='Кто создал')),
            ],
            options={
                'verbose_name': 'Задание на сборку',
                'verbose_name_plural': 'Задания на сборку',
                'ordering': ['created_at'],
            },
        ),
    ]
