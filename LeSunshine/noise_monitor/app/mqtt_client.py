import json
import paho.mqtt.client as mqtt
from .extensions import db
from .models import NoiseData
from datetime import datetime

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("home/noise")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S')
        noise_level = data['noise_level']
        
        noise_data = NoiseData(timestamp=timestamp, noise_level=noise_level)
        db.session.add(noise_data)
        db.session.commit()
        print("Data saved successfully.")
    except Exception as e:
        print(f"Error saving data: {str(e)}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Sostituisci 'mqtt_broker_url' con l'effettivo URL del tuo broker MQTT
client.connect("localhost", 1883, 60)

client.loop_start()
