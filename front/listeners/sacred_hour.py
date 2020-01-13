from fbchat import MessageReaction

from front.listeners.generic.generic import GenericListener
from front.listeners.generic.react import ReactListener


class SacredHourListener(ReactListener, GenericListener):
    NAME = "sacred_hour"
    REACT_TYPE = MessageReaction.HEART

    def before_cond(self):
        # 5 secs before...
        return self.time.hour == (self.time.minute + 1) % 60 and self.time.second >= 55

    def valid_cond(self):
        return self.time.hour == self.time.minute
