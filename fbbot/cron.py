from rq.registry import StartedJobRegistry
import django_rq

from fbchat import Message


def get_running_job():
    registry = StartedJobRegistry('bot', connection=django_rq.get_connection('bot'))
    running_ids = registry.get_job_ids()
    return django_rq.get_queue('bot').fetch_job(running_ids[0])


def send_monthly_report():
    current_job = get_running_job()
    if 'actions' not in current_job.meta:
        current_job.meta["actions"] = []

    message = Message.format_mentions("PoC monthly report")
    current_job.meta["actions"].append(
        {'send': message}
    )
    current_job.save_meta()
