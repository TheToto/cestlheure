from front.listeners.generic.list_check import ListCheckListener
from front.listeners.generic.message import MessageListener


class TacosListener(ListCheckListener, MessageListener):
    NAME = "tacos"
    LIST_HOURS = [(19, 21)]
    MESSAGE_CONTENT = "Miam miam !"
