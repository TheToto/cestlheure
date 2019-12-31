from asgiref.sync import sync_to_async
from django.core.serializers.json import DjangoJSONEncoder
import json

from .models import Message, User


class MessageEncoder(DjangoJSONEncoder):
    def default(self, o):
        if hasattr(o, '__dict__'):
            return o.__dict__
        else:
            try:
                return super(MessageEncoder, self).default(o)
            except Exception:
                return str(o)


def message_object_to_model(message_object, user_id):
    user, _ = User.objects.get_or_create(uid=user_id, defaults={
        "name": user_id,
    })
    return Message(
        uid=message_object.uid,
        text=message_object.text,
        author=user,
        time=message_object.created_at,
        full_object=json.loads(MessageEncoder().encode(message_object))
    )


async def insert_message_object(message_object):
    def save():
        message = message_object_to_model(message_object, message_object.author)
        message.save()
        return message

    return await sync_to_async(save)()


async def insert_bulk_message_objects(message_objects):
    def save():
        models = []
        for message_object in message_objects:
            models.append(message_object_to_model(message_object, message_object.author))
        Message.objects.bulk_create(models, ignore_conflicts=True)

    await sync_to_async(save)()


async def update_user_object(user_object):
    def save():
        User.objects.update_or_create(
            uid=user_object.uid, defaults={
                "name": user_object.name,
                "nickname": user_object.nickname,
                "url": user_object.url,
                "photo_url": user_object.photo}
        )

    await sync_to_async(save)()


async def get_last_timestamp():
    def get():
        try:
            return Message.objects.latest().time
        except Message.DoesNotExist:
            return None

    return await sync_to_async(get)()
