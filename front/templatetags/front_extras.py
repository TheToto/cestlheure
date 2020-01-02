from django import template

register = template.Library()


@register.simple_tag
def search_user(list_users, userid):
    for i in list_users:
        if i["message__author"] == userid:
            return i
    return None
