import django_rq
from fbbot.chat import launch_bot
import rq
from rq.registry import StartedJobRegistry


def run(*args):
    print("Empty queues")

    django_rq.get_queue('bot').empty()
    django_rq.get_queue('listen').empty()

    # Stop existing jobs
    registry = StartedJobRegistry('bot', connection=django_rq.get_connection('bot'))
    running_ids = registry.get_job_ids()
    if len(running_ids) > 1:
        for i in running_ids:
            current_job = django_rq.get_queue('bot').fetch_job(i)
            print("Delete : ", current_job)
            current_job.delete()
    else:
        for i in running_ids:
            current_job = django_rq.get_queue('bot').fetch_job(i)
            print("Send kill : ", current_job)
            current_job.meta['kill'] = "true"
            current_job.save_meta()

    if args and len(args) > 0 and args[0] == "stop":
        return

    print("Launch bot job")
    print(launch_bot.delay())
