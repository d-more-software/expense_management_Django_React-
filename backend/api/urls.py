from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('transactions/',views.TransationListCreateAPIView.as_view() ),
    path('transactions/<uuid:id>/',views.TransactionRetrieveUpdateDestroyAPIView.as_view() ),
]