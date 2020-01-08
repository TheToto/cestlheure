from django import template

from front.misc import BotStatus

register = template.Library()


@register.simple_tag
def search_user(list_users, userid):
    for i in list_users:
        if i["message__author"] == userid:
            return i
    return None


@register.filter()
def to_str(value):
    return str(value)


@register.filter()
def color_bot_status(bot_status):
    if bot_status == BotStatus.RUNNING:
        return "success"
    elif bot_status == BotStatus.WAITING:
        return "info"
    elif bot_status == BotStatus.MISSING:
        return "danger"
    elif bot_status == BotStatus.KILLING:
        return "info"
    return "primary"
