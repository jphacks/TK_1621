#!/bin/sh

# 引数
CMDNAME=`basename $0`
if [ $# -lt 1 ]; then
    echo "Usage: ${CMDNAME} [ text ]" 1>&2
    exit 1
fi

# 定数定義（出力ファイル名、辞書の場所、音声データの場所）
TMPFILE=`mktemp /tmp/tmp.`$(date +%Y%m%d%H%M%S)`.wav`
# 辞書
DIC=/usr/local/Cellar/open-jtalk/1.09/dic
# 音声データ
VOICE=/usr/local/Cellar/open-jtalk/1.09/voice/mei/mei_normal.htsvoice


# 音声データ生成
echo "$1" | open_jtalk \
-x ${DIC} \
-m ${VOICE} \
-ow ${TMPFILE} && \

# 音声データを再生
afplay ${TMPFILE}

# 生成した音声データを削除
rm -f ${TMPFILE}

# 終了
exit 0
