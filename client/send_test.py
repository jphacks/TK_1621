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


def on_message(ws, message):
    res = json.loads(message)
    text = res["text"].encode('utf-8')
    distance = 5
    print "%sメートル%s" % (distance, text)


def on_error(ws, error):
    print error


def on_close(ws):
    print "### closed ###"


def on_open(ws):
    filename = 'lib/images/demo-image.jpg'
    file = open(filename, "rb").read()
    file_data = base64.b64encode(file)
    ws.send(json.dumps({'upload_file': file_data}))

if __name__ == "__main__":
    ws_url = "ws://jphacksserver.herokuapp.com"
    # ws_url = "ws://localhost:3000"
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(ws_url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
