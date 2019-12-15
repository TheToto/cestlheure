from fbbot.models import User, Message


def run():
    Message.objects.all().delete()
    User.objects.all().delete()
