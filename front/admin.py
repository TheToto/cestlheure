from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import CestLheure, CestLheureIndex


class CestLheureAdmin(ModelAdmin):
    raw_id_fields = ['message']


class CestLheureIndexAdmin(ModelAdmin):
    raw_id_fields = ['last_listened']


# Register your models here.
admin.site.register(CestLheure, CestLheureAdmin)
admin.site.register(CestLheureIndex, CestLheureIndexAdmin)
