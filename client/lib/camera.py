#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# WebCam Setting
#
# created by Keisuke Okumura

import cv2


class Camera:
    """WEBカメラの設定
    """

    def __init__(self, use_last=True, camera_num=0,
                 image_width=1280, image_height=720, fps=30):
        self.img_path = "./images/"
        self.camera_num = camera_num
        self.image_width = image_width
        self.image_height = image_height
        self.fps = fps
        self.capture = cv2.VideoCapture(self.camera_num)
        self.set_capture()

    # ================================
    # キャプチャーの用意
    # ================================
    def set_capture(self):
        self.capture.set(3, self.image_width)
        self.capture.set(4, self.image_height)
        self.capture.set(5, self.fps)
        if self.capture.isOpened() is False:
            raise IOError('Camera cannot open.')
        print 'finish setting camera'

    # ================================
    # スナップショットを撮影
    # ================================
    def snapshot(self, name):
        ret, image = self.capture.read()
        if not ret:
            raise IOError("Cannnot shot")
        cv2.imwrite(self.img_path+name, image)
