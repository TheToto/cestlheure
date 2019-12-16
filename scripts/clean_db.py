from fbbot.models import *
from front.models import *


def run():
    Message.objects.all().delete()
    User.objects.all().delete()
    CestLheureIndex.objects.all().delete()
    CestLheure.objects.all().delete()
