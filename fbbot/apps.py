import os
from django.apps import AppConfig


class FbbotConfig(AppConfig):
    name = 'fbbot'

    def ready(self):
        if os.environ.get('ENABLE_BOT', None) == 'true':
            import django_rq
            print("Empty queues")
            django_rq.get_queue('bot').empty()
            django_rq.get_queue('listen').empty()
            from .chat import launch_bot
            launch_bot.delay()
            print("Launch bot job")
