import os
from django_rq import job

from fbbot.models import Message

from .listeners.cestlheure import CestLheureListener
from .listeners.debug import DebugListener
from .listeners.mention import MentionListener

from .models import CestLheure, CestLheureIndex


@job('listen')
def listen_message(message):
    res = []

    res += CestLheureListener(message).result
    res += MentionListener(message).result
    if os.environ.get('DEBUG', "false") == "true":
        res += DebugListener(message).result

    update_index(message)
    return res


def update_index(new_message):
    index = CestLheureIndex.objects.first()
    print("New Index: ", new_message.time)
    if index is None:
        CestLheureIndex.objects.create(last_listened=new_message)
    elif index.last_listened.time > new_message.time:
        print("ERROR !! Need re-listening : ", index.last_listened.time, " > ", new_message.time)
    else:
        index.last_listened = new_message
        index.save()


@job('listen')
def listen_missed(use_queue=False):
    index = CestLheureIndex.objects.first()

    if index is not None:
        last_ts = index.last_listened.time
        to_listen = Message.objects.filter(time__gt=last_ts).order_by('time')
    else:
        to_listen = Message.objects.all().order_by('time')

    for message in to_listen:
        print("Listen : ", message.time)
        if use_queue:
            listen_message.delay(message=message)
        else:
            listen_message(message)


def listen_all():
    CestLheure.objects.all().delete()
    CestLheureIndex.objects.all().delete()
    listen_missed.delay()
