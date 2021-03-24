#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
APP_DIR=kaios-app

cd $DIR
rm -rf $APP_DIR
mkdir -p $APP_DIR
cp manifest.webapp $APP_DIR
cd ..
yarn cpx "packages/app/build/**/*" kaios/$APP_DIR
cd $DIR
zip kaios-app.zip $APP_DIR