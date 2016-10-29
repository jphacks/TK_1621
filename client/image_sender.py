#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# created by Keisuke Okumura


from camera import Camera
import requests
import time


def send(url, filename):
    image = open('/images', 'rb')
    files = {'param_name': (filename, image, 'image/jpeg')}
    data = {'another_key': 'another_value'}
    r = requests.post(url, files=files, data=data)
    return r.text


def main():
    # カメラのセッティング
    image_width = 1280
    image_height = 720
    cam = Camera(image_width=image_width, image_height=image_height)

    interval = 1.
    filename = 'test.jpg'
    url = "http://test.com/api/image/"

    while True:
        # 画像撮影
        cam.snapshot(filename)

        # 画像をポスト
        text = send(url, filename)

        print 'send image to "%s"' % url
        time.sleep(interval)


if __name__ == '__main__':
    main()
