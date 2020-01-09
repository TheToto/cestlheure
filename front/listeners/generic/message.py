from front.listeners.generic.generic import GenericListener
from fbchat import Message


class MessageListener(GenericListener):
    MESSAGE_CONTENT = "undefined"

    def valid_action(self):
        self.result.append(
            {'send': Message(text=self.MESSAGE_CONTENT,
                             reply_to_id=self.message.uid)}
        )
