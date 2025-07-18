from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views

from tezza.views import api, chart
from tezza.views.logout import LogoutView
# from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.obtain_auth_token),
    path('api/logout/', LogoutView.as_view()),
    path('api/chart/', chart.DailyAssemblyStatsView.as_view()),
]

router = routers.DefaultRouter()
router.register('sides', api.Side, basename='sides', )
router.register('colors', api.Color, basename='colors', )
router.register('designers', api.Designer, basename='designers', )
router.register('materials', api.Material, basename='materials', )
router.register('products', api.Product, basename='products', )
router.register('customers', api.Customer, basename='customers', )
router.register('orders', api.Order, basename='orders', )
router.register('order_items', api.OrderItem, basename='order_items', )
router.register('order_products', api.OrderItem, basename='order_products', )
router.register('order_logs', api.OrderLog, basename='order_logs', )
router.register('order_comments', api.OrderComment, basename='order_comments', )
router.register('users', api.User, basename='users', )
router.register('user', api.UserViewSet, basename='user', )

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns += [
    path('api/', include(router.urls)),
]
# urlpatterns += debug_toolbar_urls()
