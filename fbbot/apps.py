import os
from django.apps import AppConfig


class FbbotConfig(AppConfig):
    name = 'fbbot'

    def ready(self):
        if os.environ.get('ENABLE_BOT', None) == 'true':
            import django_rq
            django_rq.get_queue('bot').empty()
            from .jobs import bot_job
            bot_job.delay()
            print("Launch bot job")
