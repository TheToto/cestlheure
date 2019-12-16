from asgiref.sync import sync_to_async

from front.signals import listen_missed

from .models import Message, User


def message_object_to_model(message_object, user_id):
    user, _ = User.objects.get_or_create(uid=user_id, defaults={
        "name": user_id,
    })
    return Message(
        uid=message_object.uid,
        text=message_object.text,
        author=user,
        time=message_object.created_at
    )


async def insert_message_object(message_object):
    def save():
        message_object_to_model(message_object, message_object.author).save()

    await sync_to_async(save)()


async def insert_bulk_message_objects(message_objects):
    def save():
        models = []
        for message_object in message_objects:
            models.append(message_object_to_model(message_object, message_object.author))
        Message.objects.bulk_create(models, ignore_conflicts=True)
        listen_missed()

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
