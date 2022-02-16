from django.urls import path, include
from django.urls.conf import re_path
from chamberAPI import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('api-auth/', include('rest_framework.urls',
                              namespace='rest_framework')),

    path('api/getAllBU', views.getAllBU),
    path('api/add-employer', views.add_new_RD),

    path('api/register', views.register),
    path('api/whiteboard', views.whiteboard),
    path('api/inprocess', views.inprocess),
    path('api/quit', views.quit_line)
]
