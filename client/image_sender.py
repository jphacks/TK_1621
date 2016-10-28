#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# created by Keisuke Okumura


from camera import Camera
import requests
import time


def main():
    # カメラのセッティング
    image_width = 1280
    image_height = 720
    cam = Camera(image_width=image_width, image_height=image_height)

    filename = 'test.jpg'
    url = "http://test.com/api/image/"

    while True:
        # 画像撮影
        cam.snapshot(filename)

        # 画像をポスト
        files = {'upload_file': open('images/'+filename, "rb")}
        requests.post(url, files=files)

        print 'send image to "%s"' % url
        time.sleep(1)


if __name__ == '__main__':
    main()
