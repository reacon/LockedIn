from django.urls import path, include
from .views import google_login
from . import views

urlpatterns = [
    path('google-login/', google_login, name='google-login'),
    path('check-session/', views.check_session, name='check-session'),
    path('google-logout/', views.google_logout, name='google-logout'),
]

