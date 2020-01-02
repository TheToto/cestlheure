from fbchat import Client, ThreadType
import asyncio
import os
import pyotp


# Subclass fbchat.Client and override required methods
class EchoBot(Client):
    async def on_2fa_code(self):
        return pyotp.TOTP(os.environ['BOT_TOTP']).now()

    async def on_message(self, mid=None, author_id=None, message_object=None, thread_id=None,
                         thread_type=ThreadType.USER, at=None, metadata=None, msg=None):
        await self.mark_as_delivered(thread_id, message_object.uid)
        await self.mark_as_read(thread_id)

        print(message_object)

        # If you're not the author, echo
        # if author_id != self.uid:
        #    await self.send(message_object, thread_id=thread_id, thread_type=thread_type)


loop = asyncio.get_event_loop()


async def start():
    client = EchoBot(loop=loop)
    print("Logging in...")
    await client.start(os.environ["BOT_LOGIN"], os.environ["BOT_PASSWORD"])
    print("Bot logged ! Listening...")
    client.listen()


loop.run_until_complete(start())
loop.run_forever()
