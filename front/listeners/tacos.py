from .list_check import ListCheckListener


class TacosListener(ListCheckListener):
    NAME = "tacos"
    LIST_HOURS = [(19, 21)]
    MESSAGE_CONTENT = "Miam miam !"
