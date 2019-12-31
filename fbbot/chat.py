import asyncio
import os
import pickle5 as pickle

import pyotp
from fbchat import Client
from django_rq import job

from .insert import insert_message_object, update_user_object, get_last_timestamp, insert_bulk_message_objects

from front.signals import listen_message, listen_missed


class CestLheureBot(Client):
    async def on_2fa_code(self):
        return pyotp.TOTP(os.environ['BOT_TOTP']).now()

    async def on_message(self, mid=None, author_id=None, message_object=None, thread_id=None,
                         thread_type=None, at=None, metadata=None, msg=None):
        await self.mark_as_delivered(thread_id, message_object.uid)
        await self.mark_as_read(thread_id)

        if thread_id == os.environ["THREAD_ID_CESTLHEURE"]:
            message = await insert_message_object(message_object)
            print(message)
            print(self)
            listen_job = listen_message.delay(message=message, use_bot=True)

            # Wait max 3s for result ...
            for i in range(0, 20):
                await asyncio.sleep(0.3)
                if listen_job.result is not None:
                    break

            print(listen_job.result)
            if listen_job.result is not None:
                for i in listen_job.result:
                    await self.react_to_message(i['message_uid'], i['react'])


async def dump_users(client):
    tid = os.environ["THREAD_ID_CESTLHEURE"]
    infos = await client.fetch_thread_info(tid)
    users = await client.fetch_all_users_from_threads([infos[tid]])
    for user in users:
        print("Users :", user.name)
        await update_user_object(user)


async def dump_thread(client):
    tid = os.environ["THREAD_ID_CESTLHEURE"]
    ts = None
    to_save = []
    latest_message_ts = await get_last_timestamp()
    while ts is None or latest_message_ts is None or latest_message_ts < ts:
        history = await client.fetch_thread_messages(tid, before=ts)
        if history is None:
            break
        if ts is not None:
            history.pop(0)
        if len(history) == 0:
            break
        to_save.extend(history)
        print(history[0].created_at)
        ts = history[len(history) - 1].created_at

    await insert_bulk_message_objects(to_save)
    listen_missed.delay()

    print("Finished")


def save_appstate(session_cookies):
    with open('appstate.bin', 'wb') as f:
        pickle.dump(session_cookies, f)


def get_appstate():
    try:
        with open('appstate.bin', 'rb') as fp:
            return pickle.load(fp)
    except:
        return None


async def start(loop):
    client = CestLheureBot(loop=loop)

    print("Logging in...")
    appstate = get_appstate()
    await client.start(os.environ["BOT_LOGIN"], os.environ["BOT_PASSWORD"], session_cookies=appstate)
    save_appstate(client.get_session())
    print("Logged")

    await dump_users(client)
    await dump_thread(client)
    print("Listening...")

    client.listen(markAlive=True)


@job('bot')
def launch_bot():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start(loop))
    loop.run_forever()
