from .list_check import ListCheckListener


class MirorListener(ListCheckListener):
    NAME = "miror"
    LIST_HOURS = [(0, 0),
                  (1, 10),
                  (2, 20),
                  (3, 30),
                  (4, 40),
                  (5, 50),
                  (7, 00),
                  (8, 10),
                  (9, 20),
                  (10, 1),
                  (10, 30),
                  (11, 11),
                  (12, 21),
                  (13, 31),
                  (14, 41),
                  (15, 51),
                  (17, 1),
                  (18, 11),
                  (19, 21),
                  (20, 2),
                  (20, 31),
                  (21, 12),
                  (22, 22),
                  (23, 32)]
    MESSAGE_CONTENT = "Miroir !"
