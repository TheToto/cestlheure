from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.message import MessageListener
from front.listeners.generic.generic import GenericListener


class TacosListener(ListCheckListener, MessageListener, GenericListener):
    NAME = "tacos"
    FULL_NAME = "Giga tacos"
    LIST_HOURS = [(19, 21)]
    MESSAGE_CONTENT = "Miam miam !"
