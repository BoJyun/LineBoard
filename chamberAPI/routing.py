from django.urls import re_path, path

from . import chambers

websocket_urlpatterns = [
    re_path(r'chamberAPI/ws/(?P<room_name>\w+)/$',
            chambers.ChatConsumer.as_asgi()),
    # path('chamberAPI/ws/mychamber/', chambers.ChatConsumer.as_asgi()),
]


# (\w+): 英文數字或底線一個以上
