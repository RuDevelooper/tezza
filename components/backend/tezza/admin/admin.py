from django.contrib import admin

from tezza import models

admin.site.site_header = 'TEZZA'

admin.site.register(models.Color)
admin.site.register(models.Customer)
admin.site.register(models.Material)
admin.site.register(models.OrderLog)
admin.site.register(models.OrderComment)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'sku',
        'title',
        'side',
        'side_point',
        'size',
        'price',
        'color',
        'material',
    ]


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        'product',
        'order',
        'status',
        'priority',
        'price',
    ]


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'number',
        'created_at',
        'due_date',
        'priority',
        'status',
        'products_cost',
        'delivery_cost',
        'delivery_tracking_number',
        'total_cost',
    ]
