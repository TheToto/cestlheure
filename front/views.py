from django.views.generic import TemplateView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages

from .db import get_latest_cestlheure, get_global_score, chart_ready_by_day, chart_ready_by_month, get_stars, \
    chart_ready_by_day_user, get_various_stat_global
from fbbot.models import User
from .misc import get_bot_status
from .models import CestLheure


class GlobalView(TemplateView):
    template_name = "home.html"
    base_query = CestLheure.objects.filter(type="sacred_hour")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['latest_cestlheure'] = get_latest_cestlheure(self.base_query)
        context['global_score'] = get_global_score(self.base_query)
        context['stars'] = get_stars(self.base_query)
        context['users'] = User.objects.all()
        context['bot_status'] = get_bot_status()
        return context


class DashView(GlobalView):
    alert = ""
    template_name = "dash/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['global_stat'] = get_various_stat_global(self.base_query)
        return context


class UserView(GlobalView):
    template_name = "dash/user.html"
    base_query = CestLheure.objects.filter(type="sacred_hour")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = get_object_or_404(User, pk=context['pk'])
        context['latest_cestlheure'] = get_latest_cestlheure(self.base_query)
        context['users'] = User.objects.all()
        return context


def restart_bot(request):
    from scripts import launch_bot
    launch_bot.run()
    messages.info(request, "Le bot a bien été redémarré... Attendez quelques secondes.")
    return redirect("dash")


def by_day_chart_view(request, year, month):
    base_query = CestLheure.objects.filter(type="sacred_hour")
    return JsonResponse(chart_ready_by_day(base_query, year, month), safe=False)


def by_month_chart_view(request):
    base_query = CestLheure.objects.filter(type="sacred_hour")
    return JsonResponse(chart_ready_by_month(base_query), safe=False)


def by_day_user_chart_view(request, pk):
    base_query = CestLheure.objects.filter(type="sacred_hour")
    user = get_object_or_404(User, pk=pk)
    return JsonResponse(chart_ready_by_day_user(base_query, user), safe=False)
