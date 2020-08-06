from django.shortcuts import render, redirect
from django.conf import settings
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from .models import Cart, Order
from items.models import Product
import json

def place_order(products, cart_id):
    try:
        cart_model = Cart.objects.get(pk=cart_id)
        for product in products:
            product_model = Product.objects.get(pk=product[0])
            if product_model.price == product[2] and product_model.size == product[3]:
                order_model = Order(cart=cart_model, product=product_model)
                order_model.save()
            else:
                return False
        cart_model.status = "Pending"
        cart_model.save()
        return True
    except Exception as e:
        return False

def order(request): 
    cart = json.loads(request.POST.get('data'))
    cart_model = Cart(length=cart['length'], price=cart['price'], size=cart['size'])
    cart_model.save()
    cart_id = cart_model.id
    status = place_order(cart['cart'], cart_id)
    data = {
        "cart_id": cart_id,
        "length": cart['length'],
        "price": cart['price'],
        "size": cart['size']
    }
    if status:
        return JsonResponse({"response": data}, status=200)
    else:
        return JsonResponse({"response": "error"}, status=500)

def get_cart(request, c_id):
    cart = Cart.objects.get(pk=c_id)
    qs = Order.objects.filter(cart=cart)
    products = [obj.product.serialize() for obj in qs]
    data = {
        "response": products,
    }
    return JsonResponse(data, status=200)