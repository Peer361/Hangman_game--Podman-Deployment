from django.urls import path
from .import views

urlpatterns=[
    path('start/',views.start_game),
    path('guess/<str:letter>/',views.guess_letter)
]