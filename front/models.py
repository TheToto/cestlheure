from django.db import models

from fbbot.models import Message, User


class CestLheure(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    exact_date = models.DateTimeField()
    type = models.CharField(max_length=20, default="sacred_hour")

    def __str__(self):
        return f"{str(self.exact_date.astimezone())} ({self.type}) : {str(self.message)}"

    class Meta:
        get_latest_by = "exact_date"
        ordering = ["-exact_date"]

    @classmethod
    def build_obj(cls, message, type_name):
        return cls(message=message,
                   exact_date=message.time.astimezone().replace(second=0, microsecond=0),
                   type=type_name)


class CestLheureIndex(models.Model):
    last_listened = models.ForeignKey(Message, on_delete=models.CASCADE)
