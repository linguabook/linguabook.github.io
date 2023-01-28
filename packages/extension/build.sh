#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
V=`git rev-parse --short HEAD`

cd $DIR
./copy-deps.sh
mkdir -p dist
cd src
ZIP=../dist/linguabook-extension-${V}.zip
rm -f $ZIP
zip $ZIP assets/*.* *.*
