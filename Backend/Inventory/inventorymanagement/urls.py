from django.urls import path
from .views import ProductListCreateView, SingleProductView

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', SingleProductView.as_view(), name='product-detail'),
]
