import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AlertConsumer(AsyncWebsocketConsumer):
    fire_sound_playing = False  # Keep track of whether the alarm sound is playing

    async def connect(self):
        self.room_name = 'alert_room'
        self.room_group_name = f'alert_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive alert from WebSocket (triggered by the Fire button)
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')  # Can be "fire" or "stop"
        print(f"Received action: {action}")
        
        if action == "fire":
            # Toggle the alarm sound state (if it's stopped, start it, if it's playing, stop it)
            self.fire_sound_playing = not self.fire_sound_playing

            # Broadcast the sound state to all connected users
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'alert_message',
                    'fire_sound_playing': self.fire_sound_playing,
                }
            )
        
        elif action == "stop":
            # Stop the alarm sound if it's playing
            self.fire_sound_playing = False

            # Broadcast the sound state to all connected users
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'alert_message',
                    'fire_sound_playing': self.fire_sound_playing,
                }
            )

    # Receive message from room group
    async def alert_message(self, event):
        fire_sound_playing = event['fire_sound_playing']

        # Send the current sound state to WebSocket
        await self.send(text_data=json.dumps({
            'fire_sound_playing': fire_sound_playing,
        }))
        

class LogoutConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(">>> CONNECTED:", self.channel_name)
        await self.channel_layer.group_add("logout_group", self.channel_name)
        await self.accept()
 
    async def disconnect(self, close_code):
        print(">>> DISCONNECTED:", self.channel_name)
        await self.channel_layer.group_discard("logout_group", self.channel_name)
 
    async def logout_user(self, event):
        # Send a message to the WebSocket
       print(">>> LOGOUT EVENT:", event)
       await self.send(text_data=json.dumps({
        "message": "logout",
        "value": event.get("Value", [])  
    }))        
        


