import pymongo
import os
import datetime

from front.signals import listen_missed
from fbbot.models import User, Message


def fetch_messages(mydb):
    mycol = mydb["messages"]
    mydoc = mycol.find().sort("timestamp", -1)
    users = list(User.objects.all())
    messages = []
    for x in mydoc:
        user = None
        for u in users:
            if u.uid == x["senderID"]:
                user = u
                break
        if user is None:
            user, _ = User.objects.get_or_create(uid=x["senderID"], defaults={
                "name": x["senderID"],
            })
        dt = x["timestamp"].replace(tzinfo=datetime.timezone.utc)
        print(dt)
        messages.append(Message(
            uid=x['_id'],
            text=x.get("body", None),
            author=user,
            time=dt)
        )
    print("Bulk messsage insert...")
    Message.objects.bulk_create(messages, ignore_conflicts=True)
    listen_missed()


def fetch_users(mydb):
    mycol = mydb["participants"]
    mydoc = mycol.find()
    users = []
    for x in mydoc:
        print(x['name'])
        users.append(User(
            uid=x['_id'],
            name=x['name'],
            nickname=None,
            url=x['profileUrl'],
            photo_url=x['thumbSrc'],
            color=x['color'])
        )
    print("Bulk user insert...")
    User.objects.bulk_create(users, ignore_conflicts=True)


def run():
    myclient = pymongo.MongoClient(os.environ["OLD_MONGODB_URI"])
    mydb = myclient["heroku_2z8057dw"]
    print("Import users...")
    fetch_users(mydb)
    print("Import messages...")
    fetch_messages(mydb)
