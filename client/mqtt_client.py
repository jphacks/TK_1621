#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Websocket Client
#
# created by Shun Iwase

import thread
import time
import base64
import json
import uuid
from lib.camera import Camera
from lib.acceleration import Acceralation
from lib import jtalk
from lib import ir_sensor
import paho.mqtt.client as mqtt

host = 'beam.soracom.io'
port = 1883
topic = "sh8@github/jphacks"
sub_topic = topic + '/result'
pub_topic = topic + '/image'

def on_connect(client, userdata, flags, respons_code):
    client.subscribe(sub_topic)

def on_message(client, userdata, msg):
    print msg
    res = json.loads(msg)
    text = res["text"].encode('utf-8')
    try:
        distance = ir_sensor.read_distance()
        if distance == "close":
            jtalk.speak("近くの%s" % text)
        elif distance == "far":
            jtalk.speak("遠くの%s" % text)
        else:
            jtalk.speak("%-3.2fメートル前方に%s" % (distance, text))
    except UnboundLocalError:
        print 'エラーが発生しました'

def on_publish(client, userdata, mid):
    print("publish: {0}".format(mid))

if __name__ == "__main__":
    client = mqtt.Client(protocol=mqtt.MQTTv311)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.connect(host, port=port, keepalive=60)
    client.loop_start()

    accel = Acceralation()
    camera = Camera()
    while True:
        if accel.permit_snapshot():
            filepath = uuid.uuid4()
            filename = '%s.jpg' % filepath
            camera.snapshot(filename)
            file = open('images/'+filename, "rb").read()
            file_data = base64.b64encode(file)
            client.publish(pub_topic, file_data, 0)
            time.sleep(10.0)
