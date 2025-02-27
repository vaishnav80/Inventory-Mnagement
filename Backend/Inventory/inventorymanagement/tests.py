from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Product

class ProductAPITestCase(APITestCase):

    def setUp(self):
        """Setup test data before each test"""
       
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.product = Product.objects.create(
            name="Test Product",
            description="Test description",
            price=10.99,
            stock=100
        )
        self.client.force_authenticate(user=self.user)

    def test_get_products(self):
        """Test retrieving the product list"""
        response = self.client.get("/manage/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Test Product", str(response.data)) 

    def test_create_product(self):
        """Test creating a new product"""
        data = {
            "name": "New Product",
            "description": "New description",
            "price": 15,
            "stock": 50,
            "category" : "New category"
        }
        response = self.client.post("/manage/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Product")

    def test_update_product(self):
        """Test updating an existing product"""
        data = {"name": "Updated Product"}
        response = self.client.patch(f"/manage/products/{self.product.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Updated Product")

    def test_delete_product(self):
        """Test deleting a product"""
        response = self.client.delete(f"/manage/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())  
