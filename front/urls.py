from django.urls import path

from . import views

urlpatterns = [
    path('', views.HomePageView.as_view(), name='home'),
    path('dash', views.DashView.as_view(), name='dash'),
    path('graph/global', views.by_month_chart_view, name='by_month'),
    path('graph/<int:year>/<int:month>', views.by_day_chart_view, name='by_day')
]
