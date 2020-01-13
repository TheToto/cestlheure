from front.listeners.generic.generic import GenericListener


class ListCheckListener():
    LIST_HOURS = []

    def valid_cond(self):
        t = (self.exact_date.hour, self.exact_date.minute)
        return t in self.LIST_HOURS
