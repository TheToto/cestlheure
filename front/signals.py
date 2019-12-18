from django.dispatch import receiver
from django.db.models.signals import post_save
from fbchat import MessageReaction

from fbbot.models import Message
from fbbot.signals import send_emote

from .models import CestLheure, CestLheureIndex


@receiver(post_save, sender=Message)
def listen_message(instance=None, manual=False, no_db=False, last_cestlheure=None, **kwargs):
    time = instance.time.astimezone()
    if time.hour == (time.minute + 1) % 60:
        # One minute before...
        if not manual and time.second >= 55:
            send_emote.send(None, message=instance, reaction=MessageReaction.SAD)
    if time.hour == time.minute:
        exact_date = time.replace(second=0, microsecond=0)
        if not no_db:
            last_cestlheure = CestLheure.objects.latest() if CestLheure.objects.all().exists() else None
        if last_cestlheure is None or last_cestlheure.exact_date != exact_date:
            print("C'est L'heure !")
            cestlheure = CestLheure.build_obj(instance)
            if no_db:
                return cestlheure
            cestlheure.save()
            if not manual:
                send_emote.send(None, message=instance, reaction=MessageReaction.HEART)
        elif last_cestlheure.message.time > time:
            print("New C'est L'heure !")
            # Changement ! Un problème d'ordre a eu lieu...
            if not manual:
                send_emote.send(None, message=last_cestlheure.message, reaction=None)
                send_emote.send(None, message=instance, reaction=MessageReaction.HEART)
            last_cestlheure.message = instance
            last_cestlheure.save()

    if not manual:
        update_index(instance)


def update_index(new_message):
    index = CestLheureIndex.objects.first()
    print("New Index: ", new_message.time)
    if index is None:
        CestLheureIndex.objects.create(last_listened=new_message)
    else:
        index.last_listened = new_message
        index.save()


def listen_missed():
    index = CestLheureIndex.objects.first()
    missed = []
    if index is not None:
        last_ts = index.last_listened.time
        to_listen = Message.objects.filter(time__gt=last_ts).order_by('time')
    else:
        to_listen = Message.objects.all().order_by('time')
    for message in to_listen:
        print("Listen : ", message.time)
        cestlheure = listen_message(instance=message, manual=True, no_db=True,
                                    last_cestlheure=missed[-1] if len(missed) else None)
        if cestlheure:
            missed.append(cestlheure)
    if len(to_listen) > 0:
        update_index(to_listen[len(to_listen) - 1])
    CestLheure.objects.bulk_create(missed, ignore_conflicts=True)


def listen_all():
    CestLheure.objects.all().delete()
    CestLheureIndex.objects.all().delete()
    listen_missed()


def do_nothing():
    pass
