from django.shortcuts import render, redirect
from django.conf import settings
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from .models import *

products_per_page = 2
main_url = "https://abugida.herokuapp.com/"
level_cfg = ["Beginner", "Intermediate", "Advanced"] 


def home(request):
    cat = "Music_Production"
    tag = "tutorial"
    level = "Beginner"
    st = 1
    try:
        products = Product.objects.filter(category=cat, level=level)
        qs = filter_products(products, st)
        products = [x.serialize() for x in qs]
        watchmore = "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level, st + 1)

        levels = [{"link":"{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[0], 1),"name": level_cfg[0]},
                {"link": "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[1], 1), "name": level_cfg[1]},
                {"link": "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[2], 1), "name": level_cfg[2]},
                ]
        if len(qs) < products_per_page:
            watchmore = ''
        data = {
            "response": products,
            "watchmore": watchmore,
            "tag": tag,
            "level": levels,  
        }
        if request.is_ajax():                       
            return JsonResponse(data, status=200)
        return render(request, "pages/products_list.html", context=data)
    except Exception as e:
        return JsonResponse({"response": "Something went wrong."}, status=500)


def products_list(request, cat, tag, level, st):   
    try:
        products = Product.objects.filter(category=cat, level=level)
        qs = filter_products(products, st)
        products = [x.serialize() for x in qs]
        watchmore = "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level, st + 1)

        levels = [{"link":"{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[0], 1),"name": level_cfg[0]},
                {"link": "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[1], 1), "name": level_cfg[1]},
                {"link": "{}/category={}&tag={}&level={}&page={}".format(main_url, cat, tag, level_cfg[2], 1), "name": level_cfg[2]},
                ]
        if len(qs) < products_per_page:
            watchmore = ''
        data = {
            "response": products,
            "watchmore": watchmore,
            "tag": tag,
            "level": levels,  
        }
        if request.is_ajax():                       
            return JsonResponse(data, status=200)
        return render(request, "pages/products_list.html", context=data)
    except Exception as e:
        return JsonResponse({"response": "Something went wrong."}, status=500)
    

def product(request, p_id):
    try:
        qs = Product.objects.get(pk=p_id)
        product = [qs.serialize_main()]
        data = {
            "response": product,
        }
        return render(request, "pages/product_page.html", context=data)
    except Exception as e:
        return JsonResponse({"error": e}, status=500)


def search(request, q, st):
    try:
        products = Product.objects.filter(name__contains=q)
        qs = filter_products(products, st)
        products = [x.serialize() for x in qs]
        watchmore = "{}/search={}&page={}".format(main_url, q, st + 1)
        if len(qs) < products_per_page:
                watchmore = '' 
        data = {
            "response": products,
            "watchmore": watchmore,
            "search": q,
        }     
        if request.is_ajax():
            return JsonResponse(data, status=200)

        return render(request, "pages/search.html", context=data)
    except Exception as e:
        return JsonResponse({"error": e}, status=500)
        

def category(request, cat, st):
    products = Product.objects.filter(category=cat)
    qs = filter_products(products, st)
    products = [x.serialize() for x in qs]
    data = {
        "response": products,
    }
    print('cat')
    return JsonResponse(data, status=200)

def tag(request, tag, cat, st):
    try:
        tag = Tag.objects.get(name=tag).id
        products = Product.objects.filter(tags=tag)
        qs = filter_products(products, st)
        products = [x.serialize() for x in qs]
        data = {
            "response": products,
        }
    except:
        data = {
            "response": [],
        }
    print('tag')
    return JsonResponse(data, status=200)

def filter_products(object, st):   
    st = st * products_per_page
    products_list = []
    for i in range(st-products_per_page, st):
        try:
            if object[i]:
                products_list.append(object[i])
        except:
            break
    return products_list
