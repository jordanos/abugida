from django.db import models
from items.models import Product


class Cart(models.Model):
    STATUS = (
        ('Created', 'Created'),
        ('Pending', 'Pending'),
        ('Delivered', 'Delivered'),
    )
    length = models.IntegerField()
    price = models.FloatField()
    size = models.FloatField()
    status = models.CharField(max_length=25, choices=STATUS, default=STATUS[0][0])
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Order(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)