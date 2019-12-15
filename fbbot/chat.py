from fbchat import Client
from fbchat import ThreadType
import asyncio
import os
from pprint import pprint
from .insert import insert_message_object, update_user_object


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

        if author_id != self.uid:
            await self.send(message_object, thread_id=thread_id, thread_type=thread_type)


async def dump_users(client):
    tid = os.environ["THREAD_ID_CESTLHEURE"]
    infos = await client.fetch_thread_info(tid)
    users = await client.fetch_all_users_from_threads([infos[tid]])
    for user in users:
        print("Users :", user)
        await update_user_object(user)


async def start(loop):
    client = CestLheureBot(loop=loop)
    print("Logging in...")
    await client.start("cestlheure@protonmail.com", "cestlheure12345")
    print("Logged")
    await dump_users(client)
    print("Listening...")
    client.listen()


def launch_bot():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start(loop))
    loop.run_forever()
