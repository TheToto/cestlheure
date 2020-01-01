from django.views.generic.base import TemplateView
from django.http import JsonResponse

from .db import get_latest_cestlheure, get_global_score, chart_ready_by_day, chart_ready_by_month, get_stars
from fbbot.models import User


class HomePageView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['latest_cestlheure'] = get_latest_cestlheure()
        context['global_score'] = get_global_score()
        context['stars'] = get_stars()
        context['users'] = User.objects.all()
        return context


class DashView(HomePageView):
    template_name = "dash/dashboard.html"


def by_day_chart_view(request, year, month):
    return JsonResponse(chart_ready_by_day(year, month), safe=False)


def by_month_chart_view(request):
    return JsonResponse(chart_ready_by_month(), safe=False)
