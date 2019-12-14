from .models import Message, User
from asgiref.sync import sync_to_async


async def insert_message_object(message_object):
    def save():
        user = User.objects.get(uid=message_object.author)
        Message.objects.update_or_create(
            uid=message_object.uid, defaults={
                "text": message_object.text,
                "author": user,
                "time": message_object.created_at
            }
        )

    await sync_to_async(save)()


async def insert_user_object(user_object):
    def save():
        User.objects.update_or_create(
            uid=user_object.uid, defaults={
                "name": user_object.name,
                "nickname": user_object.nickname,
                "url": user_object.url,
                "photo_url": user_object.photo}
        )

    await sync_to_async(save)()
