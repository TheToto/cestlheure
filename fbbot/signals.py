from asgiref.sync import async_to_sync
from django.dispatch import receiver, Signal

send_emote = Signal(providing_args=["message", "reaction"])


def setup_signals(client):
    @receiver(send_emote, weak=False)
    def receive_send_emote(message, reaction, **kwargs):
        async_to_sync(client.react_to_message)(message.uid, reaction)
