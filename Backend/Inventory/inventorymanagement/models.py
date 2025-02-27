from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.CharField(max_length=20)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company_id = models.ForeignKey(User,on_delete=models.CASCADE,default=1)


    def __str__(self):
        return self.name
