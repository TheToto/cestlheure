import os
import json

from .generic import GenericListener

from fbchat import Message


class MentionListener(GenericListener):
    def valid_cond(self):
        try:
            if "mentions" in self.message.full_object:
                for i in self.message.full_object["mentions"]:
                    if i["thread_id"] == os.environ["THREAD_ID_BOT"]:
                        return True
        except Exception:
            pass
        return False

    def first_cond(self):
        return True

    def valid_action(self):
        self.result.append({'send': Message(text='<message>', reply_to_id=self.message.uid)})
