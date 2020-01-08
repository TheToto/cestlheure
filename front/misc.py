from enum import Enum

from fbbot.cron import get_running_job


class BotStatus(str, Enum):
    MISSING = "Le bot n'est pas lancé !"
    KILLING = "Le bot va bientôt redemarrer..."
    WAITING = "Le bot est en train se lancer..."
    RUNNING = "Le bot semble fonctionner"

    def __str__(self):
        return self.value

    def __bool__(self):
        return self.name == BotStatus.RUNNING.name


def get_bot_status():
    job = get_running_job()
    if job is None:
        return BotStatus.MISSING
    if "kill" in job.meta:
        return BotStatus.KILLING
    if "status" in job.meta:
        return BotStatus.RUNNING
    return BotStatus.WAITING
