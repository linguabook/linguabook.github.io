#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

NM=$DIR/../../node_modules
POPPER_DIST=$NM/@popperjs/core/dist
TIPPY_DIST=$NM/tippy.js/dist

cp $POPPER_DIST/umd/popper.js $DIR/src/popper.js
cp $TIPPY_DIST/tippy-bundle.umd.js $DIR/src/tippy.js
cp $TIPPY_DIST/tippy.css $DIR/src/tippy.css
