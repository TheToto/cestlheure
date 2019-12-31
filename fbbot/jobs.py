from django_rq import job
from .chat import launch_bot


@job('bot')
def bot_job():
    launch_bot()
