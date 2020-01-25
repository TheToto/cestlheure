from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.message import MessageListener
from front.listeners.generic.generic import GenericListener


class CentralSymListener(ListCheckListener, MessageListener, GenericListener):
    NAME = "central_sym"
    FULL_NAME = "Symétrie centrale"
    LIST_HOURS = [(0, 0), (1, 10), (2, 50), (5, 20), (20, 5), (22, 55), (11, 11), (12, 51), (15, 21), (21, 15)]
    MESSAGE_CONTENT = "Symétrie centrale !"
