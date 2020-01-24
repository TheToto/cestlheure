from fbbot.models import *
from front.models import *


def run():
    CestLheureIndex.objects.all().delete()
    CestLheure.objects.all().delete()
    Message.objects.all().delete()
    User.objects.all().delete()
