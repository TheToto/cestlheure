from django.db import models
from django.contrib.postgres.fields import JSONField
from colorfield.fields import ColorField

class User(models.Model):
    uid = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=50, null=True, blank=True)
    url = models.URLField(max_length=400, null=True, blank=True)
    photo_url = models.URLField(max_length=400, null=True, blank=True)
    color = ColorField(default='#000000')

    def __str__(self):
        return self.name


class Message(models.Model):
    uid = models.CharField(primary_key=True, unique=True, max_length=50)
    text = models.TextField(null=True, blank=True)
    author = models.ForeignKey('User', on_delete=models.DO_NOTHING)
    time = models.DateTimeField()
    full_object = JSONField(null=True, blank=True)

    def __str__(self):
        body = self.text[:15] if self.text else "None"
        return f"{self.author.name} : {body}"

    class Meta:
        get_latest_by = "time"
        ordering = ["-time"]
