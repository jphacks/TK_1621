#!/bin/sh
sudo i2cdetect -y 1
sudo /usr/sbin/i2cget -y 1 0x18 0x0F b
sudo /usr/sbin/i2cset -y 1 0x18 0x20 0x27 b
