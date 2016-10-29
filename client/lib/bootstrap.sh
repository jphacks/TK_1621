#!/bin/sh

# 引数
CMDNAME=`basename $0`
if [ $# -lt 1 ]; then
    echo "Usage: ${CMDNAME} [ text ]" 1>&2
    exit 1
fi

sudo i2cdetect -y 1
sudo /usr/sbin/i2cget -y 1 0x18 0x0F b
sudo /usr/sbin/i2cset -y 1 0x18 0x20 0x27 b
