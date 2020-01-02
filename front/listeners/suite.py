from .list_check import ListCheckListener


class SuiteListener(ListCheckListener):
    NAME = "suite"
    LIST_HOURS = [(1, 23), (12, 34), (23, 45)]
    MESSAGE_CONTENT = "Suite logique !"
