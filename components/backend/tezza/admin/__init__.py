from django.contrib import admin

from tezza import models

admin.site.site_header = 'TEZZA'

admin.site.register(models.Color)
admin.site.register(models.Customer)
admin.site.register(models.Material)
admin.site.register(models.Order)
admin.site.register(models.OrderLog)
admin.site.register(models.OrderItem)
admin.site.register(models.OrderComment)
admin.site.register(models.Product)
