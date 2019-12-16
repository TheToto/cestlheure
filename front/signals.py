from django.dispatch import receiver
from django.db.models.signals import post_save
from fbbot.models import Message
from .models import CestLheure, CestLheureIndex


@receiver(post_save, sender=Message)
def listen_message(instance=None, manual=False, **kwargs):
    time = instance.time.astimezone()
    if time.hour == (time.minute + 1 % 60):
        # One minute before...
        if not manual and time.second >= 55:
            # Send sad react if near C'est L'heure
            pass
        pass
    if time.hour == time.minute:
        # C'est L'heure !
        exact_time = time.replace(second=0, microsecond=0)
        CestLheure.objects.create(message=instance, exact_date=exact_time)
        if not manual:
            # Send emote
            pass

    if not manual:
        update_index(instance)


def update_index(new_message):
    index = CestLheureIndex.objects.first()
    print("new ts", new_message.time)
    if index is None:
        CestLheureIndex.objects.create(last_listened=new_message)
    else:
        index.last_listened = new_message
        index.save()


def listen_missed():
    index = CestLheureIndex.objects.first()
    if index is not None:
        last_ts = index.last_listened.time
        to_listen = Message.objects.filter(time__gt=last_ts).order_by('time')
    else:
        to_listen = Message.objects.all().order_by('time')
    for message in to_listen:
        print("Listen : ", message)
        listen_message(instance=message, manual=True)
    if len(to_listen) > 0:
        update_index(to_listen[len(to_listen) - 1])


def listen_all():
    CestLheure.objects.all().delete()
    CestLheureIndex.objects.all().delete()
    listen_missed()


def do_nothing():
    pass
