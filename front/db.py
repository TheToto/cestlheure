from django.db.models import Count
from django.db.models.functions import TruncMonth
from .models import CestLheure


def get_latest_cestlheure():
    return CestLheure.objects.latest()


def get_global_score():
    CestLheure.objects.annotate(month=TruncMonth('message__time')).values('month', 'message__author').annotate(
        total=Count('month')).order_by()
