from ..models import CestLheure


class GenericListener:
    NAME = "undefined"

    def __init__(self, message):
        self.message = message
        self.time = message.time.astimezone()
        self.exact_date = self.time.replace(second=0, microsecond=0)
        self.result = []
        self.latest = CestLheure.objects.filter(type=self.NAME).latest() \
            if CestLheure.objects.filter(type=self.NAME).exists() else None

        if self.before_cond():
            self.before_action()

        if self.valid_cond():
            if self.first_cond():
                self.valid_action()
            else:
                self.late_action()

    def before_cond(self):
        return False

    def before_action(self):
        pass

    def valid_cond(self):
        return False

    def first_cond(self):
        return self.latest is None or self.latest.exact_date != self.exact_date

    def valid_action(self):
        pass

    def late_action(self):
        pass
