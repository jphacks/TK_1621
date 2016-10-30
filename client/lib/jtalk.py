#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# created by Keisuke Okumura

# == Kei18 PC ==
# sudo open_jtalk -x /usr/local/Cellar/open-jtalk/1.09/dic
# -m /usr/local/Cellar/open-jtalk/1.09/voice/mei/mei_normal.htsvoice
# -ow out.wav sample.txt
#
# afplay out.wav


import subprocess

def speak(t):
    script = '/home/pi/Desktop/client/lib/jtalk.sh'
    cmd = ['sh', script, t]
    subprocess.call(cmd)
