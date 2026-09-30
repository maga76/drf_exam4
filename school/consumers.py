import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.school_group = 'school_updates'
        async_to_sync(self.channel_layer.group_add)(
            self.school_group,
            self.channel_name
        )

        self.user_group = None
        if self.scope['user'].is_authenticated:
            self.user_group = 'user_' + str(self.scope['user'].id)
            async_to_sync(self.channel_layer.group_add)(
                self.user_group,
                self.channel_name
            )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.school_group,
            self.channel_name
        )

        if self.user_group:
            async_to_sync(self.channel_layer.group_discard)(
                self.user_group,
                self.channel_name
            )

    def send_notification(self, event):
        self.send(text_data=json.dumps(event['data']))
