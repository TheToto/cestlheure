import os

from front.listeners.generic.generic import GenericListener

from fbchat import Message


class MentionListener(GenericListener):
    NAME = "mention"
    FULL_NAME = "Mention"
    SAVE_TO_DB = False

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
        self.result.append(
            {'send': Message(text=f'Classement : {os.environ["WEBSITE_ROOT"]}/cestlheure/ \n'
                                  f'Ton évolution : {os.environ["WEBSITE_ROOT"]}/cestlheure/user/{self.message.author.uid}',
                             reply_to_id=self.message.uid)}
        )
