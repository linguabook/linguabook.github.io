#!/usr/bin/env bash

rm -rf node_modules
rm -rf yarn.lock

for D in `find ./packages -maxdepth 1 -type d`
do
  echo ${D}
  rm -rf ${D}/node_modules
  rm -rf ${D}/dist
  rm -rf ${D}/lib
  rm -rf ${D}/build
  rm -rf ${D}/yarn.lock
  rm -rf ${D}/*.tsbuildinfo
done
