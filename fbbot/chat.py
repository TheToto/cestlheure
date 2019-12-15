from fbchat import Client
from fbchat import ThreadType
import asyncio
import os
from pprint import pprint
from .insert import insert_message_object, update_user_object, get_last_timestamp, insert_bulk_message_objects


class CestLheureBot(Client):
    async def on_message(self, mid=None, author_id=None, message_object=None, thread_id=None,
                         thread_type=ThreadType.USER, at=None, metadata=None, msg=None):
        await self.mark_as_delivered(thread_id, message_object.uid)
        await self.mark_as_read(thread_id)

        pprint(message_object)
        print(thread_id)

        if thread_id == "2175128779192067":
            return

        if thread_id == os.environ["THREAD_ID_CESTLHEURE"]:
            await insert_message_object(message_object)

        # if author_id != self.uid:
        #    await self.send(message_object, thread_id=thread_id, thread_type=thread_type)


async def dump_users(client):
    tid = os.environ["THREAD_ID_CESTLHEURE"]
    infos = await client.fetch_thread_info(tid)
    users = await client.fetch_all_users_from_threads([infos[tid]])
    for user in users:
        print("Users :", user)
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
        print(history)
        ts = history[len(history) - 1].created_at

    await insert_bulk_message_objects(to_save)
    print("Finished")


async def start(loop):
    client = CestLheureBot(loop=loop)
    print("Logging in...")
    await client.start("cestlheure@protonmail.com", "cestlheure12345")
    print("Logged")
    await dump_users(client)
    await dump_thread(client)
    print("Listening...")
    client.listen()


def launch_bot():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start(loop))
    loop.run_forever()
