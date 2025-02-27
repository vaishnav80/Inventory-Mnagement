from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Product

class ProductAPITestCase(APITestCase):

    def setUp(self):
        
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.other_user = User.objects.create_user(username="otheruser", password="otherpassword")


        self.product = Product.objects.create(
            name="Test Product",
            description="Test description",
            price=10.99,
            stock=100,
            category="Electronics",
            company_id=self.user  
        )

        self.client.force_authenticate(user=self.user)  

    def test_get_products(self):
       
        response = self.client.get("/manage/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  
        self.assertEqual(response.data[0]["name"], "Test Product")

    def test_create_product(self):
        
        data = {
            "name": "New Product",
            "description": "New description",
            "price": 15,
            "stock": 50,
            "category": "New category"
        }
        response = self.client.post("/manage/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Product")
        self.assertEqual(Product.objects.get(name="New Product").company_id, self.user) 

    def test_update_product(self):
      
        data = {"name": "Updated Product"}
        response = self.client.patch(f"/manage/products/{self.product.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Updated Product")

    def test_cannot_update_other_users_product(self):
      
        other_product = Product.objects.create(
            name="Other Product",
            description="Other description",
            price=20,
            stock=30,
            category="Electronics",
            company_id=self.other_user  
        )

        data = {"name": "Hacked Product"}
        response = self.client.patch(f"/manage/products/{other_product.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  

    def test_delete_product(self):
       
        response = self.client.delete(f"/manage/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())  

    def test_cannot_delete_other_users_product(self):
        
        other_product = Product.objects.create(
            name="Other Product",
            description="Other description",
            price=20,
            stock=30,
            category="Electronics",
            company_id=self.other_user
        )

        response = self.client.delete(f"/manage/products/{other_product.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  
