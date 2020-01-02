from fbchat import MessageReaction

from .generic import GenericListener
from ..models import CestLheure


class SacredHourListener(GenericListener):
    NAME = "sacred_hour"

    def before_cond(self):
        # 5 secs before...
        return self.time.hour == (self.time.minute + 1) % 60 and self.time.second >= 55

    def before_action(self):
        self.result.append({'react': MessageReaction.SAD, 'message_uid': self.message.uid})

    def valid_cond(self):
        return self.time.hour == self.time.minute

    def valid_action(self):
        print("C'est L'heure !")
        self.save_to_db()
        self.result.append({'react': MessageReaction.HEART, 'message_uid': self.message.uid})

    def cancel_last_action(self):
        super().cancel_last_action()
        self.latest.delete()
