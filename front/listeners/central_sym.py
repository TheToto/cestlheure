from .list_check import ListCheckListener
from fbchat import Message


class CentralSymListener(ListCheckListener):
    NAME = "central_sym"
    LIST_HOURS = [(2, 50), (5, 20), (20, 5), (22, 55), (11, 11), (12, 51), (15, 21), (21, 15)]
    MESSAGE_CONTENT = "Symétrie centrale !"
