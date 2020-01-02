from fbchat import MessageReaction

from .generic import GenericListener
from ..models import CestLheure


class CestLheureListener(GenericListener):
    def before_cond(self):
        # 5 secs before...
        return self.time.hour == (self.time.minute + 1) % 60 and self.time.second >= 55

    def before_action(self):
        self.result.append({'react': MessageReaction.SAD, 'message_uid': self.message.uid})

    def valid_cond(self):
        return self.time.hour == self.time.minute

    def first_cond(self):
        last_cestlheure = CestLheure.objects.latest() if CestLheure.objects.all().exists() else None
        return last_cestlheure is None or last_cestlheure.exact_date != self.exact_date

    def valid_action(self):
        print("C'est L'heure !")
        CestLheure.build_obj(self.message).save()
        self.result.append({'react': MessageReaction.HEART, 'message_uid': self.message.uid})

    def late_action(self):
        last_cestlheure = CestLheure.objects.latest() if CestLheure.objects.all().exists() else None
        if last_cestlheure is not None and last_cestlheure.exact_date == self.exact_date:
            if last_cestlheure.message.time > self.message.time:
                # Oops... Listen messages in wrong order...
                self.result.append({'react': MessageReaction.NO, 'message_uid': last_cestlheure.message.uid})
                self.result.append({'react': MessageReaction.HEART, 'message_uid': self.message.uid})
                last_cestlheure.delete()
                CestLheure.build_obj(self.message).save()
