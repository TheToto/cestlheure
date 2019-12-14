import os
from threading import Thread
from django.apps import AppConfig


class FbbotConfig(AppConfig):
    name = 'fbbot'

    def ready(self):
        if os.environ.get('ENABLE_BOT', None) == 'true':
            from .chat import launch_bot
            t = Thread(target=launch_bot)
            print(t)
            t.daemon = True
            t.start()
            print("Bot Launched !")
