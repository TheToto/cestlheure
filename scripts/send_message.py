from fbbot.cron import get_running_job
from fbchat import Message


def run(*args):
    current_job = get_running_job()
    if current_job is None:
        print("No running bot")
        return
    if 'actions' not in current_job.meta:
        current_job.meta["actions"] = []

    message = Message.format_mentions(' '.join(map(str, args)))
    print(message)
    current_job.meta["actions"].append(
        {'send': message}
    )
    current_job.save_meta()
