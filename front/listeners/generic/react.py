from front.listeners.generic.generic import GenericListener
from fbchat import MessageReaction


class ReactListener():
    REACT_TYPE = MessageReaction.WOW

    def valid_action(self):
        self.result.append({'react': self.REACT_TYPE, 'message_uid': self.message.uid})
