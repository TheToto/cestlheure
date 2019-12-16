from django.db import models


class User(models.Model):
    uid = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=50, null=True)
    url = models.URLField(null=True)
    photo_url = models.URLField(null=True)
    color = models.CharField(max_length=20, null=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    uid = models.CharField(primary_key=True, max_length=50)
    text = models.TextField(null=True)
    author = models.ForeignKey('User', on_delete=models.DO_NOTHING)
    time = models.DateTimeField()

    def __str__(self):
        body = self.text[:15] if self.text else "None"
        return f"{self.author.name} : {body}"

    class Meta:
        get_latest_by = "time"
        ordering = ["-time"]
