from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class AuthTests(APITestCase):

    def setUp(self):
        """Set up test data before each test"""
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.register_url = "/auth/register/"
        self.login_url = "/auth/login/"
        self.logout_url = "/auth/logout/"

    def test_register_user(self):
        """Test registering a new user"""
        data = {"formData": {
            "username": "newuser",
            "password": "newpassword"
        }}
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User registered successfully")

    def test_login_valid_user(self):
        """Test logging in with valid credentials"""
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)  
        self.assertIn("refresh", response.data)

    def test_login_invalid_user(self):
        """Test logging in with invalid credentials"""
        data = {"username": "wronguser", "password": "wrongpassword"}
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid Credentials")

    def test_logout_user(self):
        """Test logging out a user"""
        refresh = RefreshToken.for_user(self.user) 
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')  
        response = self.client.post(self.logout_url, {"refresh": str(refresh)}, format="json")
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
        self.assertEqual(response.data["message"], "Successfully logged out")
