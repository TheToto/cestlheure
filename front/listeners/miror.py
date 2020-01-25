from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.message import MessageListener
from front.listeners.generic.generic import GenericListener


class MirorListener(ListCheckListener, MessageListener, GenericListener):
    NAME = "miror"
    FULL_NAME = "Miroir"
    LIST_HOURS = [(0, 0),
                  (1, 10),
                  (2, 20),
                  (3, 30),
                  (4, 40),
                  (5, 50),
                  (10, 1),
                  (11, 11),
                  (12, 21),
                  (13, 31),
                  (14, 41),
                  (15, 51),
                  (20, 2),
                  (21, 12),
                  (22, 22),
                  (23, 32)]
    MESSAGE_CONTENT = "Miroir !"
