#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Websocket Client
#
# created by Shun Iwase

import websocket
import thread
import time
import base64
import json
import uuid
from lib.camera import Camera
from lib.acceleration import Acceralation
from lib import jtalk
from lib import ir_sensor


def on_message(ws, message):
    print message
    res = json.loads(message)
    text = res["text"].encode('utf-8')
    # TODO 超音波センサで動くようにする
    distance = ir_sensor.read_distance()
    jtalk.speak("%-3.2fメートル%s" % (distance, text))
    ws.close()


def on_error(ws, error):
    print error
    ws.close()


def on_close(ws):
    print "### closed ###"


def on_open(ws):
    camera = Camera()
    filepath = uuid.uuid4()
    filename = '%s.jpg' % filepath
    camera.snapshot(filename)
    file = open('images/'+filename, "rb").read()
    file_data = base64.b64encode(file)
    ws.send(json.dumps({'upload_file': file_data}))
    time.sleep(0.2)

if __name__ == "__main__":
    ws_url = "ws://jphacksserver.herokuapp.com/"
    websocket.enableTrace(True)
    accel = Acceralation()
    while True:
        if accel.permit_snapshot():
            ws = websocket.WebSocketApp(ws_url,
                    on_message=on_message,
                    on_error=on_error,
                    on_close=on_close)
            ws.on_open = on_open
            ws.run_forever()
        time.sleep(10.0)
