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


@register.filter()
def icon_bot_status(bot_status):
    if bot_status == BotStatus.RUNNING:
        return "fas fa-shield-check"
    elif bot_status == BotStatus.MISSING:
        return "fas fa-exclamation-triangle"
    else:
        return "fas fa-exclamation-circle"


@register.simple_tag
def listeners_format(listeners):
    res = []
    for l in listeners:
        if l.SAVE_TO_DB:
            res.append({    
                "name": l.NAME,
                "full_name": l.FULL_NAME
            })
    return res
