from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.message import MessageListener
from front.listeners.generic.generic import GenericListener


class SuiteListener(ListCheckListener, MessageListener, GenericListener):
    NAME = "suite"
    FULL_NAME = "Suite logique"
    LIST_HOURS = [(1, 23), (12, 34), (23, 45)]
    MESSAGE_CONTENT = "Suite logique !"
