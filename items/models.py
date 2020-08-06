from django.db import models
from django.db.models.fields.files import ImageFieldFile
import os

class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    CATEGORY = (
        ('Music_Production', 'Music_Production'),
        ('Programming', 'Programming'),
        ('Video_editing', 'Video_editing'),
        ('Animation&3D_modeling', 'Animation&3D_modeling'),
        ('English', 'English'),
        ('Pschology', 'Pschology'),
        ('Dancing', 'Dancing'),
        ('Painting', 'Painting'),
        ('Architecture', 'Architecture'),
        ('Graphics', 'Graphics'),
        ('Designing_Clothes', 'Designing_Clothes'),
    )
    LEVEL = [
        ('Beginner' ,'Beginner'),
        ('Intermediate' ,'Intermediate'),
        ('Advanced' ,'Advanced'),
    ]
    name = models.CharField(max_length=50)
    price = models.FloatField()
    category = models.CharField(max_length=100, choices=CATEGORY)
    file_id = models.CharField(max_length=10, unique=True)
    size = models.FloatField()
    level = models.CharField(max_length=15, choices=LEVEL, default=LEVEL[0][0])
    image = models.CharField(max_length=100, null=True)
    s_desc_en = models.TextField(null=True, blank=True)
    s_desc_amh = models.TextField(null=True, blank=True)
    l_desc_en = models.TextField(null=True, blank=True)
    l_desc_amh = models.TextField(null=True, blank=True)
    popularity = models.IntegerField(default=1)
    timestamp = models.DateTimeField(auto_now_add=True)
    trailer = models.CharField(max_length=200, null=True, blank=True)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.name
    
    def encode_datetime(self, obj):
        """
        Extended encoder function that helps to serialize dates and images
        """

        if isinstance(obj, ImageFieldFile):
            try:
                return obj.path
            except ValueError as e:
                return ''

        raise TypeError(repr(obj) + " is not JSON serializable")
    
    def get_absolute_image(self):
        return os.path.join('/media', str(self.image.name))
    
    def serialize(self):
        return{
        "id": self.id,
        "name": self.name,
        "price": self.price,
        "category": self.category,
        "file_id": self.file_id,
        "size": self.size,
        "level": self.level,
        "image": self.image,
        "s_desc_amh": self.s_desc_amh,
        "s_desc_en": self.s_desc_en,
        "popularity": self.popularity,
        "timestamp": self.timestamp,
        "trailer": self.trailer,
        }

    def serialize_main(self):
        return{
        "id": self.id,
        "name": self.name,
        "price": self.price,
        "category": self.category,
        "file_id": self.file_id,
        "size": self.size,
        "level": self.level,
        "image": self.image,
        "s_desc_amh": self.s_desc_amh,
        "s_desc_en": self.s_desc_en,
        "l_desc_amh": self.l_desc_amh,
        "l_desc_en": self.l_desc_en,
        "popularity": self.popularity,
        "timestamp": self.timestamp,
        "trailer": self.trailer,
        }




# class Recomendation(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     recomendation = models.ForeignKey(Product, on_delete=models.CASCADE)


