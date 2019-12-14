import pymongo
import os
from fbbot.models import User, Message
import datetime


def save_messages(doc):
    user = User.objects.get(uid=doc["senderID"])
    dt = doc["timestamp"].replace(tzinfo=datetime.timezone.utc)
    print(dt)
    Message.objects.update_or_create(
        uid=doc['_id'], defaults={
            "text": doc.get("body", None),
            "author": user,
            "time": dt
        }
    )


def fetch_messages(mydb):
    mycol = mydb["messages"]
    mydoc = mycol.find().sort("timestamp", -1)
    for x in mydoc:
        save_messages(x)


def save_users(doc):
    print(doc['name'])
    User.objects.update_or_create(
        uid=doc['_id'], defaults={
            "name": doc['name'],
            "nickname": None,
            "url": doc['profileUrl'],
            "photo_url": doc['thumbSrc'],
            "color": doc['color']
        }
    )


def fetch_users(mydb):
    mycol = mydb["participants"]
    mydoc = mycol.find()
    for x in mydoc:
        save_users(x)


def run():
    myclient = pymongo.MongoClient(os.environ["OLD_MONGODB_URI"])
    mydb = myclient["heroku_2z8057dw"]
    print("Import users...")
    fetch_users(mydb)
    print("Import messages...")
    fetch_messages(mydb)
