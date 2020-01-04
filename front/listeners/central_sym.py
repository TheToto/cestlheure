from .list_check import ListCheckListener


class CentralSymListener(ListCheckListener):
    NAME = "central_sym"
    LIST_HOURS = [(0, 0), (1,10), (2, 50), (5, 20), (20, 5), (22, 55), (11, 11), (12, 51), (15, 21), (21, 15)]
    MESSAGE_CONTENT = "Symétrie centrale !"
