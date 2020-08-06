from django.db import models


class Post(models.Model):
    name = models.CharField(max_length=50)
    cost = models.IntegerField()
    file_id = models.CharField(max_length=10)
    size = models.IntegerField()
    image = models.ImageField(upload_to='images/')
    description = models.TextField()
    main_group = models.CharField(max_length=25)
    sub_group = models.CharField(max_length=25)
    popularity = models.IntegerField(default=1)
    date = models.DateTimeField(auto_now_add=True)

