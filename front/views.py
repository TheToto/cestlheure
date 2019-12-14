from django.shortcuts import render
from django.http import HttpResponse
from django.apps import apps

Message = apps.get_model('fbbot', 'Message')
User = apps.get_model('fbbot', 'User')


def index(request):
    return HttpResponse("Hello World.")
