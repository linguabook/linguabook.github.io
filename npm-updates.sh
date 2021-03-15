#!/usr/bin/env bash

echo "=== ROOT === " && ncu
pushd packages/app && echo "=== APP === " && ncu && popd
pushd packages/components && echo "=== COMPONENTS === " && ncu && popd
pushd packages/extension && echo "=== EXTENSION === " && ncu && popd
