import django_rq
from fbbot.cron import send_monthly_report


def run():
    scheduler = django_rq.get_scheduler('listen')
    list_of_job_instances = scheduler.get_jobs(with_times=True)
    for i in list_of_job_instances:
        scheduler.cancel(i[0])

    scheduler.cron(
        "10 0 0 1 * *",
        func=send_monthly_report,
        args=[],
        kwargs={},
        repeat=None,
        queue_name='listen',
        meta={}
    )
