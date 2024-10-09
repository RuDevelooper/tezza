from django.contrib import admin

from tezza import models

admin.site.site_header = 'TEZZA'

admin.site.register(models.Color)
admin.site.register(models.Material)
admin.site.register(models.OrderLog)


# admin.site.register(models.OrderComment)


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
    search_fields = [
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
        'added_at',
        'assembled_at',
    ]
    ordering = ['-added_at']
    date_hierarchy = 'added_at'


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
    search_fields = [
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
    list_filter = [
        'created_at',
        'due_date',
        'priority',
        'status',
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'organisation',
        'address',
        'phone',
    ]
    search_fields = [
        'organisation',
        'name',
        'address',
        'phone',
    ]
    ordering = ["name"]


@admin.register(models.Designer)
class DesignerAdmin(admin.ModelAdmin):
    list_display = [
        'name',
    ]
    search_fields = [
        'name',
    ]
    ordering = ["name"]


@admin.register(models.MonthlyPlan)
class MonthlyPlanAdmin(admin.ModelAdmin):
    list_display = [
        'year',
        'month',
        'items',
        'added_at',
    ]
    search_fields = [
        'year',
        'month',
    ]
    ordering = [
        'year',
        'month',
    ]
