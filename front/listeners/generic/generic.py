from front.models import CestLheure

from fbchat import MessageReaction


class GenericListener:
    SAVE_TO_DB = True
    NAME = "undefined"
    FULL_NAME = "undefined"

    def __init__(self, message):
        self.message = message
        self.time = message.time.astimezone()
        self.exact_date = self.time.replace(second=0, microsecond=0)
        self.result = []
        self.latest = CestLheure.objects.filter(type=self.NAME).latest() \
            if CestLheure.objects.filter(type=self.NAME).exists() else None
        self.current = None

        if self.before_cond():
            self.before_action()

        if self.valid_cond():

            if self.first_cond():
                if self.SAVE_TO_DB:
                    self.current = CestLheure.build_obj(self.message, self.NAME)
                    self.current.save()
                self.valid_action()

            elif self.wrong_order_cond():
                if self.SAVE_TO_DB:
                    self.latest.delete()
                self.cancel_last_action()
                self.valid_action()

            else:
                self.late_action()

    def before_cond(self):
        return False

    def before_action(self):
        self.result.append({'react': MessageReaction.SAD, 'message_uid': self.message.uid})

    def valid_cond(self):
        return False

    def first_cond(self):
        return self.latest is None or self.latest.exact_date != self.exact_date

    def valid_action(self):
        pass

    def wrong_order_cond(self):
        if self.latest:
            return self.latest.message.time > self.message.time
        return False

    def cancel_last_action(self):
        self.result.append({'react': MessageReaction.NO, 'message_uid': self.latest.message.uid})

    def late_action(self):
        pass
