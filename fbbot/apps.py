import os
from django.apps import AppConfig


def test2():
    print("test!!")


class FbbotConfig(AppConfig):
    name = 'fbbot'

    def ready(self):
        if os.environ.get('ENABLE_BOT', None) == 'true':
            from scripts import setup_cron, launch_bot
            launch_bot.run()
            setup_cron.run()
