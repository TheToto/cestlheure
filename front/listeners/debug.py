from front.listeners.generic.generic import GenericListener

from fbchat import MessageReaction


class DebugListener(GenericListener):
    NAME = "debug"
    FULL_NAME = "Debug"
    SAVE_TO_DB = False

    def valid_cond(self):
        return True

    def first_cond(self):
        return True

    def valid_action(self):
        print(self.message)
        self.result.append({'react': MessageReaction.YES, 'message_uid': self.message.uid})
