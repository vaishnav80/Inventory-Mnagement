from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import redis
import json
from django.conf import settings
import logging

redis_client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0, decode_responses=True)

logger = logging.getLogger(__name__)

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter products so users only see their own products"""
        return Product.objects.filter(company_id=self.request.user)

    def perform_create(self, serializer):
        """Ensure the product is associated with the logged-in user"""
        serializer.save(company_id=self.request.user)

class SingleProductView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Restrict access so users can only retrieve/update/delete their own products"""
        return Product.objects.filter(company_id=self.request.user)

    def get_object(self):
        """Retrieve product with Redis caching"""
        product_id = self.kwargs['pk']
        cache_key = f"product:{product_id}"

        if redis_client.exists(cache_key):
            logger.info("Fetching from Redis")
            product_data = json.loads(redis_client.get(cache_key))

            if "image" in product_data and product_data["image"]:
                product_data["image"] = f"{settings.MEDIA_URL}{product_data['image']}"

            try:
                return Product.objects.get(pk=product_id, company_id=self.request.user)
            except Product.DoesNotExist:
                return None
        else:
            logger.info("Fetching from DB and storing in Redis")
            product = super().get_object()
            product_data = ProductSerializer(product).data

            if "image" in product_data and product_data["image"]:
                product_data["image"] = product.image.name  

            redis_client.setex(cache_key, 3600, json.dumps(product_data))
            return product

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        updated_data = serializer.data
        if "image" in updated_data and updated_data["image"]:
            updated_data["image"] = product.image.name  

        product_id = self.kwargs['pk']
        cache_key = f"product:{product_id}"
        redis_client.setex(cache_key, 3600, json.dumps(updated_data))

        return Response(updated_data)

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        if product:
            product_id = self.kwargs['pk']
            cache_key = f"product:{product_id}"

            response = super().destroy(request, *args, **kwargs)
            redis_client.delete(cache_key)
            return response
        else:
            return Response({"error": "Product not found"}, status=404)
