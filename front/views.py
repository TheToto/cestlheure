from django.http import HttpResponse

from .signals import listen_missed


def index(request):
    listen_missed()
    return HttpResponse("Hello World.")
