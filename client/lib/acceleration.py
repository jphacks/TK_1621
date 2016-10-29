#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# created by Keisuke Okumura


import smbus
import numpy as np
import time


def s18(value):
    return -(value & 0b100000000000) | (value & 0b011111111111)


class Acceralation(object):
    """加速度センサーの値を取得
    """

    def __init__(self):
        self.i2c = smbus.SMBus(1)
        self.address = 0x18
        self.__threshold = 1200
        self.__notmoving = 500

    # ===============================
    # 数値の取得
    # ===============================
    def get(self):
        x_l = self.i2c.read_byte_data(self.address, 0x28)
        x_h = self.i2c.read_byte_data(self.address, 0x29)
        x_a = (x_h << 8 | x_l) >> 4
        x_a = s18(x_a)/1024.0*980.0

        y_l = self.i2c.read_byte_data(self.address, 0x2A)
        y_h = self.i2c.read_byte_data(self.address, 0x2B)
        y_a = (y_h << 8 | y_l) >> 4
        y_a = s18(y_a)/1024.0*980.0

        z_l = self.i2c.read_byte_data(self.address, 0x2C)
        z_h = self.i2c.read_byte_data(self.address, 0x2D)
        z_a = (z_h << 8 | z_l) >> 4
        z_a = s18(z_a)/1024.0*980.0 - 980.0  # 重力加速度は考慮しない

        return (x_a, y_a, z_a)

    # ===============================
    # 結果を出力
    # ===============================
    def print_result(self):
        x_a, y_a, z_a = self.get()
        gal = np.sqrt(x_a**2+y_a**2+z_a**2)
        print ("X-Value:%6.2f" % (x_a))
        print ("Y-Value:%6.2f" % (y_a))
        print ("Z-Value:%6.2f" % (z_a))
        print ("Gal:%6.2f" % (gal))

    # ===============================
    # 撮影するかの判断
    # ===============================
    def permit_snapshot(self):
        x, y, z = self.get()
        mag = np.sqrt(x**2+y**2+z**2)
        return (self.__notmoving < mag and mag < self.__threshold)


def main():
    sensor = Acceralation()

    while True:
        x, y, z = sensor.get()
        print np.sqrt(x**2+y**2+z**2)
        time.sleep(0.1)


if __name__ == '__main__':
    main()
