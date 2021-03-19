#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR
mkdir -p dist
cd src
ZIP=../dist/linguabook-extension.zip
rm -f $ZIP
zip $ZIP assets/*.* *.*
