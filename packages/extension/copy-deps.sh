#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

NM=$DIR/../../node_modules

cp $NM/interactjs/dist/interact.js $DIR/src/lib/interact.js
cp $NM/jquery/dist/jquery.js $DIR/src/lib/jquery.js
cp $NM/@popperjs/core/dist/umd/popper.js $DIR/src/lib/popper.js
