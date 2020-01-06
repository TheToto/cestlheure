from fbchat import Client, ThreadType
import asyncio
import os
import pyotp
import pickle5 as pickle


# Subclass fbchat.Client and override required methods
class EchoBot(Client):
    async def on_2fa_code(self):
        if os.environ.get("OTP_CUR", None):
            return os.environ["OTP_CUR"]
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


def save_appstate(session_cookies):
    with open('appstate.bin', 'wb') as f:
        pickle.dump(session_cookies, f)


def get_appstate():
    try:
        with open('appstate.bin', 'rb') as fp:
            return pickle.load(fp)
    except:
        return None


async def start():
    client = EchoBot(loop=loop)
    print("Logging in...")
    appstate = get_appstate()
    await client.start(os.environ["BOT_LOGIN"], os.environ["BOT_PASSWORD"], session_cookies=appstate)
    save_appstate(client.get_session())
    print("Bot logged ! Listening...")
    client.listen()


loop.run_until_complete(start())
loop.run_forever()
