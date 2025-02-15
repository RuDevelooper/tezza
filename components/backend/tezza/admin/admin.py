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
        'color__title',
        'material__title',
    ]


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        'product',
        'order',
        'status',
        'priority',
        'price',
        'discount',
        'added_at',
        'assembler',
        'assembled_at',
    ]
    search_fields = [
        'product__sku',
        'order__number',
        'assembler__first_name',
        'assembler__last_name',
    ]
    list_filter = [
        'added_at',
        'assembled_at',
        'status',
        'discount',
        'priority',
    ]
    list_select_related = True
    ordering = ['-added_at']
    date_hierarchy = 'added_at'


class OrderItemInline(admin.TabularInline):
    model = models.OrderItem
    fields = [
        'product',
        'status',
        'priority',
        'price',
        'discount',
        'assembled_at',
        'assembler',
    ]
    readonly_fields = [
        'product',
        'assembled_at',
        'assembler',
        'status',
        'price',
        'discount',
    ]
    can_delete = False
    show_change_link = True
    extra = 0


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderItemInline,
    ]
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


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'order_item',
        'work_type',
        'status',
        'assembler',
        'created_at',
        'due_date',
        'completed_at',
        # 'order_item__product',
        # 'order_item__order',
        'created_by',
    ]
    search_fields = [
        'created_at',
        'due_date',
        'order_item',
        'order_item__product__sku',
        'order_item__order__number',
        'created_by',
        'work_type',
        'status',
        'assembler',
        'completed_at',
    ]
    list_filter = [
        'created_at',
        'due_date',
        'work_type',
        'status',
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
