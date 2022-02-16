import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # self.room = "mylist"
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room = self.scope['url_route']['kwargs']['room_name']
        async_to_sync(self.channel_layer.group_add)(
            self.room, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(message)
        async_to_sync(self.channel_layer.group_send)(self.room, {
            "type": "chat_message",
            "message": ["fileChange", True],
        })

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'fileChange': message[0],
            'success': message[1]
        }))
