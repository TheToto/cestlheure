from django.urls import path

from . import views

urlpatterns = [
    path('old', views.HomePageView.as_view(), name='old'),
    path('', views.DashView.as_view(), name='dash'),
    path('user/<int:pk>', views.UserView.as_view(), name='user'),
    path('graph/global', views.by_month_chart_view, name='by_month'),
    path('graph/<int:year>/<int:month>', views.by_day_chart_view, name='by_day'),
    path('graph/user/<int:pk>', views.by_day_user_chart_view, name='by_day_user')
]
