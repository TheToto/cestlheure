from fbchat import MessageReaction

from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.react import ReactListener
from front.listeners.generic.generic import GenericListener


class MirorPlusListener(ListCheckListener, ReactListener, GenericListener):
    NAME = "miror_plus"
    FULL_NAME = "Miroir (Plus)"
    LIST_HOURS = [(7, 0),
                  (8, 10),
                  (9, 20),
                  (10, 30),
                  (17, 1),
                  (18, 11),
                  (19, 21),
                  (20, 31)]
    REACT_TYPE = MessageReaction.YES
