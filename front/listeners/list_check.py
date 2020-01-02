from .generic import GenericListener
from fbchat import Message


class ListCheckListener(GenericListener):
    LIST_HOURS = []
    MESSAGE_CONTENT = "undefined"

    def valid_cond(self):
        t = (self.exact_date.hour, self.exact_date.minute)
        return t in self.LIST_HOURS

    def valid_action(self):
        self.save_to_db()
        self.result.append(
            {'send': Message(text=self.MESSAGE_CONTENT,
                             reply_to_id=self.message.uid)}
        )
