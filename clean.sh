#!/usr/bin/env bash

rm -rf node_modules

for D in `find ./packages -maxdepth 1 -type d`
do
  echo ${D}
  rm -rf ${D}/node_modules
  rm -rf ${D}/dist
  rm -rf ${D}/lib
  rm -rf ${D}/build
done
