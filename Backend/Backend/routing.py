from django.urls import path
from django.urls import re_path
from whiteboard.consumers import AlertConsumer,LogoutConsumer

websocket_urlpatterns = [
    path('ws/alert/', AlertConsumer.as_asgi()),
    re_path(r'ws/logout/$', LogoutConsumer.as_asgi()),
]